$(document).ready(function () {
    const clickSound = new Audio('path/to/deep_click_sound.mp3');
    const restoreSound = new Audio('path/to/fading_air_sound.mp3');
    let isEnlarged = false;

    // Handle click for images
    $('body').on('click', 'img.enlargeable', function (event) {
        if (!isEnlarged) {
            clickSound.play(); // Play click sound

            const imageUrl = $(this).attr('src');
            const enlargedImageContainer = $('<div>').addClass('enlarged-image-container');
            const enlargedImage = $('<img>').addClass('enlarged-image').attr('src', imageUrl).attr('alt', 'Enlarged Image');

            enlargedImageContainer.append(enlargedImage);
            $('body').append(enlargedImageContainer);

            // Prevent removal when clicking on the enlarged image
            enlargedImage.click(function (event) {
                event.stopPropagation();
            });

            isEnlarged = true;
        } else {
            restoreSound.play(); // Play restore sound
            $('.enlarged-image-container').remove();
            isEnlarged = false;
        }
    });

    // Handle click for text description divs
    $('body').on('click', 'div.popupable', function (event) {
        if (!isEnlarged) {
            clickSound.play(); // Play click sound

            const textContent = $(this).text();
            const enlargedContent = $('<div>').addClass('enlarged-content');
            const closeButton = $('<span>').addClass('close-button').text('✖');

            enlargedContent.text(textContent);
            enlargedContent.append(closeButton);
            $('body').append(enlargedContent);

            // Prevent removal when clicking on the enlarged content
            enlargedContent.click(function (event) {
                event.stopPropagation();
            });

            isEnlarged = true;
        } else {
            restoreSound.play(); // Play restore sound
            $('.enlarged-content').remove();
            isEnlarged = false;
        }
    });

    // Click anywhere else to remove the enlargement
    $('body').on('click', function () {
        if (isEnlarged) {
            restoreSound.play(); // Play restore sound
            $('.enlarged-image-container, .enlarged-content').remove();
            isEnlarged = false;
        }
    });
});
