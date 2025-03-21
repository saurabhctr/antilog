from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import uuid
import shortuuid
import logging

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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.listing_id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.customer_id'), nullable=False)
    status = db.Column(db.Enum('Confirmed', 'Payment Made', 'KYC Done', 'Awaiting Logistics', 'Delivered'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Logistics(db.Model):
    __tablename__ = 'logistics'
    logistics_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    transporter_details = db.Column(db.JSON)
    pickup_date = db.Column(db.Date)
    delivery_date = db.Column(db.Date)
    status = db.Column(db.Enum('Scheduled', 'In Transit', 'Delivered'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    existing_user = User.query.filter_by(mobile_number=data['mobile_number']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400
    
    new_user = User(
        mobile_number=data['mobile_number'],
        name=data.get('name'),
        email=data.get('email'),
        addresses=data.get('addresses'),
        kyc_status=False
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/listings', methods=['POST'])
def create_listing():
    data = request.json
    new_listing = Listing(
        customer_id=data['customer_id'],
        product_type=data['product_type'],
        purchase_date=data['purchase_date'],
        invoice_value=data['invoice_value'],
        brand=data['brand'],
        model_name=data.get('model_name'),
        images=data.get('images'),
        location_pincode=data['location_pincode'],
        status='Active'
    )
    db.session.add(new_listing)
    db.session.commit()
    return jsonify({'message': 'Listing created successfully'}), 201

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    new_order = Order(
        listing_id=data['listing_id'],
        borrower_id=data['borrower_id'],
        status='Confirmed'
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({'message': 'Order placed successfully'}), 201

@app.route('/logistics', methods=['POST'])
def assign_logistics():
    data = request.json
    new_logistics = Logistics(
        order_id=data['order_id'],
        transporter_details=data['transporter_details'],
        pickup_date=data.get('pickup_date'),
        delivery_date=data.get('delivery_date'),
        status='Scheduled'
    )
    db.session.add(new_logistics)
    db.session.commit()
    return jsonify({'message': 'Logistics assigned successfully'}), 201

# Run app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
