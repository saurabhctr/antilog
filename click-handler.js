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
        enlargedImage.click(function () {
            // Check if the element has the 'enlarged' class
            if (enlargedImageContainer.hasClass('enlarged')) {
                // Play restore sound
                restoreSound.play();
                // Remove the enlarged class after the restore sound is played
                setTimeout(function () {
                    enlargedImageContainer.removeClass('enlarged');
                }, restoreSound.duration * 1000);
            }
        });

        // Remove the container after the transition
        setTimeout(function () {
            enlargedImageContainer.remove();
        }, (enlargedImageContainer.hasClass('enlarged') ? 500 : 0)); // Add 500ms delay if the container is in enlarged state
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
            // Check if the element has the 'enlarged' class
            if (enlargedContent.hasClass('enlarged')) {
                // Play restore sound
                restoreSound.play();
                // Remove the enlarged class after the restore sound is played
                setTimeout(function () {
                    enlargedContent.removeClass('enlarged');
                }, restoreSound.duration * 1000);
            }
        });

        // Remove the container after the transition
        setTimeout(function () {
            enlargedContent.remove();
        }, (enlargedContent.hasClass('enlarged') ? 500 : 0)); // Add 500ms delay if the container is in enlarged state
    });
});
