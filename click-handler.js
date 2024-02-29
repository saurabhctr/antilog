$(document).ready(function () {
    const clickSound = new Audio('resources/audio/deep_click_sound.mp3');
    const restoreSound = new Audio('resources/audio/fading_air_sound.mp3');

    // Handle click for images
    $('body').on('click', 'img.enlargeable', function () {
        const imageUrl = $(this).attr('src');
        const enlargedImageContainer = $('<div>').addClass('enlarged-image-container');
        const enlargedImage = $('<img>').addClass('enlarged-image').attr('src', imageUrl).attr('alt', 'Enlarged Image');

        enlargedImageContainer.append(enlargedImage);
        $('body').append(enlargedImageContainer);

        // Play click sound
        clickSound.play();

        // Add a class to indicate the enlarged state
        enlargedImageContainer.addClass('enlarged');

        // Remove the class and play restore sound when clicked again
        enlargedImageContainer.click(function () {
            if (enlargedImageContainer.hasClass('enlarged')) {
                // Play restore sound
                restoreSound.play();
                // Remove the enlarged class
                enlargedImageContainer.removeClass('enlarged');
            }
        });
    });

    // Handle click for text description divs
    $('body').on('click', 'div.popupable', function () {
        const textContent = $(this).text();
        const enlargedContent = $('<div>').addClass('enlarged-content');
        const closeButton = $('<span>').addClass('close-button').text('✖');

        enlargedContent.text(textContent);
        enlargedContent.append(closeButton);
        $('body').append(enlargedContent);

        // Play click sound
        clickSound.play();

        // Add a class to indicate the enlarged state
        enlargedContent.addClass('enlarged');

        // Remove the class and play restore sound when clicked again
        closeButton.click(function () {
            if (enlargedContent.hasClass('enlarged')) {
                // Play restore sound
                restoreSound.play();
                // Remove the enlarged class
                enlargedContent.removeClass('enlarged');
            }
        });
    });
});
