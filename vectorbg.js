// Setup the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = 'starfield'; // Assign an ID to the canvas
document.body.appendChild(renderer.domElement);

// Add stars
var starsGeometry = new THREE.BufferGeometry();
var starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

var starsVertices = [];
for (var i = 0; i < 10000; i++) {
    var x = (Math.random() - 0.5) * 2000;
    var y = (Math.random() - 0.5) * 2000;
    var z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
var stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the scene for some animation
    stars.rotation.x += 0.0005;
    stars.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the animation as soon as the page is loaded
document.addEventListener('DOMContentLoaded', animate);
