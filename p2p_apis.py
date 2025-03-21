from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from geopy.distance import geodesic
import logging
import os
import csv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://accessor:12345678@localhost/p2p'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    mobile_number = db.Column(db.String(15), unique=True, nullable=False)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    addresses = db.Column(db.JSON)
    kyc_status = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Listing(db.Model):
    __tablename__ = 'listings'
    listing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.customer_id'), nullable=False)
    product_type = db.Column(db.Enum('AC', 'TV', 'Refrigerator', 'Microwave', 'Bed', 'Sofa', 'Table', 'Chair', 'PlayStation'), nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    invoice_value = db.Column(db.Numeric(10, 2), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    model_name = db.Column(db.String(100))
    images = db.Column(db.JSON)
    location_pincode = db.Column(db.String(10), nullable=False)
    status = db.Column(db.Enum('Active', 'Draft', 'Inactive'))
    length_cm = db.Column(db.Numeric(10, 2), nullable=False)
    width_cm = db.Column(db.Numeric(10, 2), nullable=False)
    height_cm = db.Column(db.Numeric(10, 2), nullable=False)
    weight_kg = db.Column(db.Numeric(10, 2), default=100)
    rental_price_per_month = db.Column(db.Numeric(10, 2), nullable=False) 
    min_rental_months = db.Column(db.Integer, default=1)
    max_rental_months = db.Column(db.Integer, default=12)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('listings', lazy=True))

class Order(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.listing_id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.customer_id'), nullable=False)
    status = db.Column(db.Enum('Confirmed', 'Payment Made', 'KYC Done', 'Awaiting Logistics', 'Delivered', 'Completed', 'Cancelled'), nullable=False)
    rental_duration_months = db.Column(db.Integer, nullable=False, default=1)
    rental_price_per_month = db.Column(db.Numeric(10, 2))
    total_rental_price = db.Column(db.Numeric(10, 2))
    platform_fee = db.Column(db.Numeric(10, 2))
    logistics_fee = db.Column(db.Numeric(10, 2))
    ancillary_service_fee = db.Column(db.Numeric(10, 2))
    tax = db.Column(db.Numeric(10, 2))
    kyc_completed_at = db.Column(db.DateTime)
    kyc_status = db.Column(db.Boolean, default=False)
    payment_datetime = db.Column(db.DateTime)
    logistic_slot = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    listing = db.relationship('Listing', backref=db.backref('orders', lazy=True))
    borrower = db.relationship('User', foreign_keys=[borrower_id], backref=db.backref('borrowed_orders', lazy=True))

class Logistics(db.Model):
    __tablename__ = 'logistics'
    logistics_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    transporter_details = db.Column(db.JSON)
    pickup_date = db.Column(db.Date)
    delivery_date = db.Column(db.Date)
    status = db.Column(db.Enum('Scheduled', 'In Transit', 'Delivered'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    order = db.relationship('Order', backref=db.backref('logistics_info', lazy=True))

class PincodeMaster(db.Model):
    __tablename__ = 'pincode_master'
    pincode = db.Column(db.String(10), primary_key=True)
    latitude = db.Column(db.Numeric(10, 6), nullable=False)
    longitude = db.Column(db.Numeric(10, 6), nullable=False)
    district = db.Column(db.String(100))
    state_name = db.Column(db.String(100))

class DeliverySlot(db.Model):
    __tablename__ = 'delivery_slots'
    slot_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), unique=True)
    slot_datetime = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum('Scheduled', 'Completed', 'Cancelled'), default='Scheduled')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    order = db.relationship('Order', backref=db.backref('delivery_slot', uselist=False))

# Helper Functions
def get_distance_between_pincodes(pincode1, pincode2):
    """Calculate distance between two pincodes using the pincode master table"""
    try:
        location1 = PincodeMaster.query.filter_by(pincode=pincode1).first()
        location2 = PincodeMaster.query.filter_by(pincode=pincode2).first()
        
        if not location1 or not location2:
            return None
        
        coords1 = (float(location1.latitude), float(location1.longitude))
        coords2 = (float(location2.latitude), float(location2.longitude))
        
        distance = geodesic(coords1, coords2).kilometers
        return distance
    except Exception as e:
        logger.error(f"Error calculating distance: {str(e)}")
        return None

def calculate_logistics_cost(listing_id, borrower_pincode=None, distance_km=None):
    """Calculate logistics cost based on distance and item dimensions"""
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return None
        
        # If distance is not provided, calculate it from pincodes
        if distance_km is None and borrower_pincode:
            distance_km = get_distance_between_pincodes(listing.location_pincode, borrower_pincode)
            if distance_km is None:
                return None
        elif distance_km is None:
            return None
        
        # Base fare for first 5 KM
        base_fare = 200
        
        # Check if item has large dimensions
        is_large_dimension = (float(listing.length_cm) * float(listing.width_cm) * float(listing.height_cm)) > (100 * 50 * 50)
        
        # Check if item is heavy
        is_heavy = float(listing.weight_kg) > 200
        
        # Calculate cost per km
        cost_per_km = 45  # Base cost per km
        if is_large_dimension:
            cost_per_km += 5  # Additional cost for large items
        
        # Calculate extra weight charge
        extra_weight_charge = 2 if is_heavy else 0
        
        # Calculate total logistics cost
        # Base fare for first 5 KM, then additional cost per KM beyond that
        if distance_km <= 5:
            total_cost = base_fare
        else:
            additional_distance = distance_km - 5
            additional_cost = additional_distance * (cost_per_km + extra_weight_charge)
            total_cost = base_fare + additional_cost
        
        return round(total_cost, 2)
    except Exception as e:
        logger.error(f"Error calculating logistics cost: {str(e)}")
        return None

def calculate_order_pricing(listing_id, rental_duration_months, borrower_pincode=None, distance_km=None):
    """Calculate all pricing components for an order"""
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return None
        
        # Calculate rental price
        rental_price_per_month = float(listing.rental_price_per_month)
        total_rental_price = rental_price_per_month * rental_duration_months
        
        # Calculate logistics fee
        logistics_fee = calculate_logistics_cost(listing_id, borrower_pincode, distance_km)
        if logistics_fee is None:
            return None
        
        # Calculate platform fee (10% of total rental price)
        platform_fee = round(total_rental_price * 0.10, 2)
        
        # Calculate ancillary service fee (5% of total rental price)
        ancillary_service_fee = round(total_rental_price * 0.05, 2)
        
        # Calculate tax (18% of all fees)
        tax = round((platform_fee + logistics_fee + ancillary_service_fee) * 0.18, 2)
        
        # Calculate total cost
        total_cost = total_rental_price + platform_fee + logistics_fee + ancillary_service_fee + tax
        
        pricing = {
            'rental_price_per_month': rental_price_per_month,
            'rental_duration_months': rental_duration_months,
            'total_rental_price': total_rental_price,
            'platform_fee': platform_fee,
            'logistics_fee': logistics_fee,
            'ancillary_service_fee': ancillary_service_fee,
            'tax': tax,
            'total_cost': total_cost
        }
        
        return pricing
    except Exception as e:
        logger.error(f"Error calculating order pricing: {str(e)}")
        return None

# API Routes - User Management
@app.route('/api/users/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        if not data or 'mobile_number' not in data:
            return jsonify({'error': 'Mobile number is required'}), 400
        
        existing_user = User.query.filter_by(mobile_number=data['mobile_number']).first()
        if existing_user:
            return jsonify({'error': 'User with this mobile number already exists'}), 400
        
        new_user = User(
            mobile_number=data['mobile_number'],
            name=data.get('name'),
            email=data.get('email'),
            addresses=data.get('addresses', {}),
            kyc_status=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'customer_id': new_user.customer_id
        }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in user registration: {str(e)}")
        return jsonify({'error': 'Failed to register user'}), 500

@app.route('/api/users/update', methods=['PUT'])
def update_user():
    try:
        data = request.json
        if not data or 'customer_id' not in data:
            return jsonify({'error': 'Customer ID is required'}), 400
        
        user = User.query.get(data['customer_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update user information
        if 'name' in data:
            user.name = data['name']
        
        if 'email' in data:
            user.email = data['email']
        
        if 'addresses' in data:
            user.addresses = data['addresses']
        
        if 'kyc_status' in data:
            user.kyc_status = data['kyc_status']
        
        db.session.commit()
        
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating user: {str(e)}")
        return jsonify({'error': 'Failed to update user'}), 500

@app.route('/api/users/<int:customer_id>', methods=['GET'])
def get_user(customer_id):
    try:
        user = User.query.get(customer_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = {
            'customer_id': user.customer_id,
            'mobile_number': user.mobile_number,
            'name': user.name,
            'email': user.email,
            'addresses': user.addresses,
            'kyc_status': user.kyc_status,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }
        
        return jsonify(user_data), 200
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        return jsonify({'error': 'Failed to fetch user'}), 500

# API Routes - Listings Management
@app.route('/api/listings/create', methods=['POST'])
def create_listing():
    try:
        data = request.json
        required_fields = ['customer_id', 'product_type', 'purchase_date', 'invoice_value', 
                          'brand', 'location_pincode', 'length_cm', 'width_cm', 'height_cm',
                          'rental_price_per_month']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate customer exists
        customer = User.query.get(data['customer_id'])
        if not customer:
            return jsonify({'error': 'Invalid customer ID'}), 400
        
        # Parse purchase date
        try:
            purchase_date = datetime.strptime(data['purchase_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid purchase date format. Use YYYY-MM-DD'}), 400
        
        new_listing = Listing(
            customer_id=data['customer_id'],
            product_type=data['product_type'],
            purchase_date=purchase_date,
            invoice_value=data['invoice_value'],
            brand=data['brand'],
            model_name=data.get('model_name'),
            images=data.get('images'),
            location_pincode=data['location_pincode'],
            status=data.get('status', 'Active'),
            length_cm=data['length_cm'],
            width_cm=data['width_cm'],
            height_cm=data['height_cm'],
            weight_kg=data.get('weight_kg', 100),
            rental_price_per_month=data['rental_price_per_month'],
            min_rental_months=data.get('min_rental_months', 1),
            max_rental_months=data.get('max_rental_months', 12)
        )
        
        db.session.add(new_listing)
        db.session.commit()
        
        return jsonify({
            'message': 'Listing created successfully',
            'listing_id': new_listing.listing_id
        }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating listing: {str(e)}")
        return jsonify({'error': 'Failed to create listing'}), 500

@app.route('/api/listings/update/<int:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    try:
        data = request.json
        listing = Listing.query.get(listing_id)
        
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        # Update listing fields if provided
        if 'product_type' in data:
            listing.product_type = data['product_type']
        
        if 'purchase_date' in data:
            listing.purchase_date = datetime.strptime(data['purchase_date'], '%Y-%m-%d').date()
        
        if 'invoice_value' in data:
            listing.invoice_value = data['invoice_value']
        
        if 'brand' in data:
            listing.brand = data['brand']
        
        if 'model_name' in data:
            listing.model_name = data['model_name']
        
        if 'images' in data:
            listing.images = data['images']
        
        if 'location_pincode' in data:
            listing.location_pincode = data['location_pincode']
        
        if 'status' in data:
            listing.status = data['status']
        
        if 'length_cm' in data:
            listing.length_cm = data['length_cm']
        
        if 'width_cm' in data:
            listing.width_cm = data['width_cm']
        
        if 'height_cm' in data:
            listing.height_cm = data['height_cm']
        
        if 'weight_kg' in data:
            listing.weight_kg = data['weight_kg']
            
        if 'rental_price_per_month' in data:
            listing.rental_price_per_month = data['rental_price_per_month']
            
        if 'min_rental_months' in data:
            listing.min_rental_months = data['min_rental_months']
            
        if 'max_rental_months' in data:
            listing.max_rental_months = data['max_rental_months']
        
        db.session.commit()
        
        return jsonify({'message': 'Listing updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating listing: {str(e)}")
        return jsonify({'error': 'Failed to update listing'}), 500

@app.route('/api/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        listing_data = {
            'listing_id': listing.listing_id,
            'customer_id': listing.customer_id,
            'lender_name': listing.user.name,
            'product_type': listing.product_type,
            'purchase_date': listing.purchase_date.isoformat() if listing.purchase_date else None,
            'invoice_value': float(listing.invoice_value),
            'brand': listing.brand,
            'model_name': listing.model_name,
            'images': listing.images,
            'location_pincode': listing.location_pincode,
            'status': listing.status,
            'length_cm': float(listing.length_cm),
            'width_cm': float(listing.width_cm),
            'height_cm': float(listing.height_cm),
            'weight_kg': float(listing.weight_kg),
            'rental_price_per_month': float(listing.rental_price_per_month),
            'min_rental_months': listing.min_rental_months,
            'max_rental_months': listing.max_rental_months,
            'created_at': listing.created_at.isoformat() if listing.created_at else None
        }
        
        return jsonify(listing_data), 200
    except Exception as e:
        logger.error(f"Error fetching listing: {str(e)}")
        return jsonify({'error': 'Failed to fetch listing'}), 500

@app.route('/api/listings/search', methods=['GET'])
def search_listings():
    try:
        # Get query parameters
        product_type = request.args.get('product_type')
        brand = request.args.get('brand')
        pincode = request.args.get('pincode')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        status = request.args.get('status', 'Active')  # Default to active listings
        
        # Start with base query
        query = Listing.query.filter(Listing.status == status)
        
        # Apply filters if provided
        if product_type:
            query = query.filter(Listing.product_type == product_type)
        
        if brand:
            query = query.filter(Listing.brand.like(f'%{brand}%'))
        
        if pincode:
            # Get all pincodes within 20km of the provided pincode
            nearby_pincodes = []
            target_pincode = PincodeMaster.query.get(pincode)
            
            if target_pincode:
                all_pincodes = PincodeMaster.query.all()
                target_coords = (float(target_pincode.latitude), float(target_pincode.longitude))
                
                for p in all_pincodes:
                    p_coords = (float(p.latitude), float(p.longitude))
                    distance = geodesic(target_coords, p_coords).kilometers
                    if distance <= 20:  # Within 20km
                        nearby_pincodes.append(p.pincode)
                
                if nearby_pincodes:
                    query = query.filter(Listing.location_pincode.in_(nearby_pincodes))
        
        if min_price:
            query = query.filter(Listing.rental_price_per_month >= min_price)
        
        if max_price:
            query = query.filter(Listing.rental_price_per_month <= max_price)
        
        # Execute query with pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Format results
        listings = []
        for listing in pagination.items:
            listings.append({
                'listing_id': listing.listing_id,
                'product_type': listing.product_type,
                'brand': listing.brand,
                'model_name': listing.model_name,
                'images': listing.images,
                'location_pincode': listing.location_pincode,
                'rental_price_per_month': float(listing.rental_price_per_month),
                'min_rental_months': listing.min_rental_months,
                'max_rental_months': listing.max_rental_months,
                'dimensions': {
                    'length_cm': float(listing.length_cm),
                    'width_cm': float(listing.width_cm),
                    'height_cm': float(listing.height_cm),
                },
                'weight_kg': float(listing.weight_kg)
            })
        
        return jsonify({
            'listings': listings,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        logger.error(f"Error searching listings: {str(e)}")
        return jsonify({'error': 'Failed to search listings'}), 500

@app.route('/api/listings/user/<int:customer_id>', methods=['GET'])
def get_user_listings(customer_id):
    try:
        # Get query parameters
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Start with base query for user's listings
        query = Listing.query.filter(Listing.customer_id == customer_id)
        
        # Apply status filter if provided
        if status:
            query = query.filter(Listing.status == status)
        
        # Order by created_at (newest first)
        query = query.order_by(Listing.created_at.desc())
        
        # Execute query with pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Format results
        listings = []
        for listing in pagination.items:
            # Get active orders for this listing
            active_orders = Order.query.filter(
                Order.listing_id == listing.listing_id,
                Order.status.in_(['Confirmed', 'Payment Made', 'KYC Done', 'Awaiting Logistics', 'Delivered'])
            ).count()
            
            listings.append({
                'listing_id': listing.listing_id,
                'product_type': listing.product_type,
                'brand': listing.brand,
                'model_name': listing.model_name,
                'images': listing.images,
                'location_pincode': listing.location_pincode,
                'status': listing.status,
                'rental_price_per_month': float(listing.rental_price_per_month),
                'has_active_orders': active_orders > 0,
                'created_at': listing.created_at.isoformat() if listing.created_at else None
            })
        
        return jsonify({
            'listings': listings,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching user listings: {str(e)}")
        return jsonify({'error': 'Failed to fetch user listings'}), 500

# API Routes - Distance and Logistics
@app.route('/api/pincodes/distance', methods=['GET'])
def calculate_pincode_distance():
    try:
        pincode1 = request.args.get('pincode1')
        pincode2 = request.args.get('pincode2')
        
        if not pincode1 or not pincode2:
            return jsonify({'error': 'Both pincodes are required'}), 400
        
        distance = get_distance_between_pincodes(pincode1, pincode2)
        
        if distance is None:
            return jsonify({'error': 'Could not calculate distance. One or both pincodes may be invalid'}), 400
        
        return jsonify({
            'pincode1': pincode1,
            'pincode2': pincode2,
            'distance_km': round(distance, 2)
        }), 200
    except Exception as e:
        logger.error(f"Error calculating pincode distance: {str(e)}")
        return jsonify({'error': 'Failed to calculate distance'}), 500

@app.route('/api/logistics/calculate-cost', methods=['POST'])
def logistics_cost_calculator():
    try:
        data = request.json
        
        if not data or 'listing_id' not in data:
            return jsonify({'error': 'Listing ID is required'}), 400
        
        # Check if borrower_pincode or distance_km is provided
        borrower_pincode = data.get('borrower_pincode')
        distance_km = data.get('distance_km')
        
        if not borrower_pincode and distance_km is None:
            return jsonify({'error': 'Either borrower_pincode or distance_km must be provided'}), 400
        
        # Calculate logistics cost
        logistics_cost = calculate_logistics_cost(data['listing_id'], borrower_pincode, distance_km)
        
        if logistics_cost is None:
            return jsonify({'error': 'Failed to calculate logistics cost'}), 400
        
        return jsonify({
            'listing_id': data['listing_id'],
            'logistics_cost': logistics_cost
        }), 200
    except Exception as e:
        logger.error(f"Error calculating logistics cost: {str(e)}")
        return jsonify({'error': 'Failed to calculate logistics cost'}), 500

# API Routes - Orders
@app.route('/api/orders/calculate-pricing', methods=['POST'])
def calculate_order_price():
    try:
        data = request.json
        
        if not data or 'listing_id' not in data or 'rental_duration_months' not in data:
            return jsonify({'error': 'Listing ID and rental duration are required'}), 400
        
        # Check if borrower_pincode or distance_km is provided
        borrower_pincode = data.get('borrower_pincode')
        distance_km = data.get('distance_km')
        
        if not borrower_pincode and distance_km is None:
            return jsonify({'error': 'Either borrower_pincode or distance_km must be provided'}), 400
        
        # Calculate order pricing
        pricing = calculate_order_pricing(
            data['listing_id'], 
            int(data['rental_duration_months']), 
            borrower_pincode, 
            distance_km
        )
        
        if pricing is None:
            return jsonify({'error': 'Failed to calculate pricing'}), 400
        
        return jsonify({
            'listing_id': data['listing_id'],
            'pricing': pricing
        }), 200
    except Exception as e:
        logger.error(f"Error calculating order pricing: {str(e)}")
        return jsonify({'error': 'Failed to calculate order pricing'}), 500

@app.route('/api/orders/create', methods=['POST'])
def create_order():
    try:
        data = request.json
        required_fields = ['listing_id', 'borrower_id', 'rental_duration_months', 'borrower_pincode']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate listing exists and is active
        listing = Listing.query.get(data['listing_id'])
        if not listing:
            return jsonify({'error': 'Invalid listing ID'}), 400
        
        if listing.status != 'Active':
