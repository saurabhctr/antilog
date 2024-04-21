class WebcamCapture {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.captureButton = document.createElement('button');
        this.startButton = document.createElement('button');
        this.videoStream = null;

        this.setup();
    }

    setup() {
        // Set up video element
        this.video.setAttribute('autoplay', '');
        this.video.setAttribute('playsinline', ''); // for iOS devices

        // Set up canvas
        this.canvas.style.display = 'none';

        // Set up buttons
        this.startButton.innerHTML = 'Start Capture';
        this.captureButton.innerHTML = 'Capture Image';
        this.captureButton.style.display = 'none';

        // Append elements to the container
        this.container.appendChild(this.startButton);
        this.container.appendChild(this.video);
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.captureButton);

        // Event listeners
        this.startButton.addEventListener('click', () => this.startVideo());
        this.captureButton.addEventListener('click', () => this.captureImage());

        // Overlay
        this.overlay = document.createElement('img');
        this.overlay.src = '/resources/assets/images/image_raw_palm.png'; // Replace with the path to your overlay image
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '50px'; // Adjust as necessary
        this.overlay.style.left = '100px'; // Adjust as necessary
        this.container.appendChild(this.overlay);
        this.overlay.style.display = 'none';
    }

    startVideo() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                this.videoStream = stream;
                this.video.srcObject = stream;
                this.video.play();
                this.startButton.style.display = 'none';
                this.captureButton.style.display = 'inline';
                this.overlay.style.display = 'inline';
            }).catch(error => {
                console.error("Error accessing the webcam: ", error);
            });
        } else {
            alert("Your browser does not support webcam access.");
        }
    }

    captureImage() {
        // Ensure the canvas has the same dimensions as the video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        const context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // Optionally, convert the canvas to a data URL and do something with it
        const imageDataUrl = this.canvas.toDataURL('image/png');

        console.log('Image captured'); // You can replace this with any function to save the image
        this.stopVideo();
    }

    stopVideo() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.video.style.display = 'none';
            this.captureButton.style.display = 'none';
            this.overlay.style.display = 'none';
            this.startButton.style.display = 'inline';
        }
    }
}

// Usage
// new WebcamCapture('webcam-container'); // Uncomment and replace 'webcam-container' with the ID of the div where you want this
