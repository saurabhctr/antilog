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
        // Video setup
        this.video.setAttribute('autoplay', '');
        this.video.setAttribute('playsinline', ''); // Necessary for video to play inline on iOS devices
        this.container.appendChild(this.video);

        // Canvas setup
        this.canvas.style.display = 'none';
        this.container.appendChild(this.canvas);

        // Start Button setup
        this.startButton.innerHTML = 'Start Capture';
        this.startButton.style.cssText = "padding: 10px 20px; font-size: 16px; background-color: gold; color: white; border: none; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); cursor: pointer;";
        this.container.appendChild(this.startButton);
        this.startButton.addEventListener('click', () => this.startVideo());

        // Capture Button setup
        this.captureButton.innerHTML = 'Capture Image';
        this.captureButton.style.display = 'none';
        this.container.appendChild(this.captureButton);
        this.captureButton.addEventListener('click', () => this.captureImage());

        // Overlay setup
        this.overlay = document.createElement('img');
        this.overlay.src = '/resources/assets/images/image_raw_palm.png'; // Update the path as needed
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.objectFit = 'cover';
        this.overlay.style.opacity = '0.6';
        this.overlay.style.filter = 'sepia(20%)';
        this.overlay.style.display = 'none';
        this.container.style.position = 'relative';
        this.container.appendChild(this.overlay);
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
                alert("Error accessing the webcam: " + error.message);
            });
        } else {
            alert("Webcam is not supported by your browser.");
        }
    }

    captureImage() {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        const context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        const imageDataUrl = this.canvas.toDataURL('image/png');
        
        fetch(imageDataUrl).then(res => res.blob()).then(blob => {
            const formData = new FormData();
            formData.append('image', blob, 'capture.png'); // Append the image Blob to FormData
            formData.append('created_by', 'user'); // Example data, update with actual data
            formData.append('image_purpose', 'Palm_identification'); // Example data, update with actual data

            return fetch(`${window.API_BASE_URL}:5000/upload`, {
                method: 'POST',
                body: formData
            });
        }).then(response => response.json()).then(data => {
            if (data && data.document_id) {
                this.displayPreview(data.document_id);
            } else {
                throw new Error('Image upload failed.');
            }
        }).catch(error => {
            console.error('Error uploading image:', error);
        });
        console.log('Image captured');
        this.stopVideo();
    }

    displayPreview(documentId) {
        const imageUrl = `${window.API_BASE_URL}:5000/image/${documentId}`;
        const preview = new Image();
        preview.src = imageUrl;
        preview.onload = () => {
            this.container.appendChild(preview);

            const closeButton = document.createElement('button');
            closeButton.innerHTML = '❌';
            closeButton.style.cssText = 'position: absolute; top: 10px; right: 10px; background: none; border: none; color: red; font-size: 24px; cursor: pointer;';
            closeButton.onclick = () => {
                this.container.removeChild(preview);
                this.container.removeChild(closeButton);
                this.video.style.display = 'block';
                this.captureButton.style.display = 'inline';
                this.overlay.style.display = 'inline';
            };

            this.container.appendChild(closeButton);
            this.video.style.display = 'none';
            this.captureButton.style.display = 'none';
            this.overlay.style.display = 'none';
        };
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

// Ensure this is called after the DOM is fully loaded
new WebcamCapture('webcam-container');
