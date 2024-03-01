$(document).ready(function () {
    // Function to handle image click
    $('body').on('click', '.card-detail-image', function () {
        const imageUrl = $(this).attr('src');

        // Create overlay container
        const overlayContainer = $('<div>').addClass('image-overlay');
        const overlayImage = $('<img>').addClass('overlay-image').attr('src', imageUrl).attr('alt', 'Enlarged Image');

        overlayContainer.append(overlayImage);
        $('body').append(overlayContainer);

        // Add a class to indicate the enlarged state
        overlayContainer.addClass('enlarged');

        // Handle a second click on the enlarged image to restore
        overlayContainer.one('click', function () {
            // Remove the 'enlarged' class after the second click
            overlayContainer.removeClass('enlarged');
            // Remove the overlay after the restore animation
            setTimeout(function () {
                overlayContainer.remove();
            }, 500);
        });
    });
});
