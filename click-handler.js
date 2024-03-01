$(document).ready(function () {
    const clickSound = new Audio('resources/audio/deep_click_sound.mp3');
    const restoreSound = new Audio('resources/audio/fading_air_sound.mp3');

    // Function to handle click for images
$('body').on('click', 'img.enlargeable', function () {
    const imageUrl = $(this).attr('src');

    // Create overlay container
    const overlayContainer = $('<div>').addClass('image-overlay');
    const overlayImage = $('<img>').addClass('overlay-image').attr('src', imageUrl).attr('alt', 'Enlarged Image');

    overlayContainer.append(overlayImage);
    $('body').append(overlayContainer);

    // Play click sound
    clickSound.play();

    // Add a class to indicate the enlarged state
    overlayContainer.addClass('enlarged');

    // Handle a second click on the enlarged image to restore
    overlayContainer.one('click', function () {
        // Play restore sound
        restoreSound.play();

        // Remove the 'enlarged' class after the second click
        overlayContainer.removeClass('enlarged');

        // Remove the overlay after the restore animation
        setTimeout(function () {
            overlayContainer.remove();
        }, restoreSound.duration * 1000);
    });
});

// Function to handle click for text description divs
$('body').on('click', 'div.popupable', function () {
    const textContent = $(this).text();

    // Create overlay container
    const overlayContainer = $('<div>').addClass('text-overlay');
    const overlayContent = $('<div>').addClass('overlay-content');
    const closeButton = $('<span>').addClass('close-button').text('✖');

    overlayContent.text(textContent);
    overlayContent.append(closeButton);
    overlayContainer.append(overlayContent);
    $('body').append(overlayContainer);

    // Play click sound
    clickSound.play();

    // Add a class to indicate the enlarged state
    overlayContainer.addClass('enlarged');

    // Handle a second click on the enlarged content to restore
    closeButton.one('click', function () {
        // Play restore sound
        restoreSound.play();

        // Remove the 'enlarged' class after the second click
        overlayContainer.removeClass('enlarged');

        // Remove the overlay after the restore animation
        setTimeout(function () {
            overlayContainer.remove();
        }, restoreSound.duration * 1000);
    });
});


    // Handle click for card detail page on white spaces of the card
    $('body').on('click', '.card', function (event) {
        // Extract the card_id from the clicked card
        const cardId = $(this).attr('data-card-id');

        // Open the card detail page with the correct card_id
        window.location.href = `card-detail.html?card_id=${cardId}`;
    });
});
