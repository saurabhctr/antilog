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
        this.video.setAttribute('autoplay', '');
        this.video.setAttribute('playsinline', ''); // Necessary for video to play inline on iOS devices

        this.canvas.style.display = 'none';

        this.startButton.innerHTML = 'Start Capture';
        this.captureButton.innerHTML = 'Capture Image';
        this.captureButton.style.display = 'none';

        this.container.appendChild(this.startButton);
        this.container.appendChild(this.video);
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.captureButton);

        this.startButton.addEventListener('click', () => this.startVideo());
        this.captureButton.addEventListener('click', () => this.captureImage());

        this.overlay = document.createElement('img');
        this.overlay.src = '/resources/assets/images/image_raw_palm.png'; // Make sure this path is correct
        this.overlay.style.position = 'absolute';
        this.overlay.style.display = 'none';
        this.container.appendChild(this.overlay);
    }

    startVideo() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    this.videoStream = stream;
                    this.video.srcObject = stream;
                    this.video.play();
                    this.startButton.style.display = 'none';
                    this.captureButton.style.display = 'inline';
                    this.overlay.style.display = 'inline';
                })
                .catch(error => {
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
        // Convert the data URL to a Blob
        fetch(imageDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('image', blob, 'capture.png'); // Append the image Blob to FormData
                formData.append('created_by', 'user'); // Example data, update with actual data
                formData.append('image_purpose', 'identification'); // Example data, update with actual data
                // etc...

                // Send the image to the server
                return fetch(':5000/upload', {
                    method: 'POST',
                    body: formData
                });
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.document_id) {
                    this.displayPreview(data.document_id);
                } else {
                    throw new Error('Image upload failed.');
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
        console.log('Image captured');
        this.stopVideo();
    }
    displayPreview(documentId) {
        // Fetch the image from the server using the document ID
        const imageUrl = `:5000/image/${documentId}`;

        // Create an image element for the preview
        const preview = new Image();
        preview.src = imageUrl;
        preview.onload = () => {
            this.container.appendChild(preview); // Add the preview image to the DOM

            // Create a close button to hide the preview and show the capture button again
            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close Preview';
            closeButton.onclick = () => {
                this.container.removeChild(preview);
                this.container.removeChild(closeButton);
                this.video.style.display = 'block';
                this.captureButton.style.display = 'inline';
            };

            this.container.appendChild(closeButton);
            // Hide the video and capture button
            this.video.style.display = 'none';
            this.captureButton.style.display = 'none';
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

// Usage
new WebcamCapture('webcam-container'); // Ensure this is called after the DOM is fully loaded
