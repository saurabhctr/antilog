document.addEventListener('DOMContentLoaded', function() {
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    // Extract orderId from the query parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    // Function to generate QR code based on orderId
    function generateQRCode(orderId) {
        // Replace API_BASE_URL with your actual API base URL
        const qrCodeImageUrl = `${window.API_BASE_URL}/resources/assets/images/pqr.png`;
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = qrCodeImageUrl;
        qrCodeContainer.appendChild(qrCodeImage);
    }

    // Generate QR code
    generateQRCode(orderId);

    // // Set timeout to redirect to success page after 10 seconds
    // setTimeout(function() {
    //     window.location.href = 'success-page.html';
    // }, 10000); // 10 seconds
});