$(document).ready(function () {
    const clickSound = new Audio('resources/audio/deep_click_sound.mp3');
    const restoreSound = new Audio('resources/audio/fading_air_sound.mp3');

    // Handle click for images
    $('body').on('click', 'img.enlargeable', function () {
        clickSound.play(); // Play click sound

        const imageUrl = $(this).attr('src');
        const enlargedImageContainer = $('<div>').addClass('enlarged-image-container');
        const enlargedImage = $('<img>').addClass('enlarged-image').attr('src', imageUrl).attr('alt', 'Enlarged Image');

        enlargedImageContainer.append(enlargedImage);
        $('body').append(enlargedImageContainer);

        enlargedImageContainer.click(function () {
            restoreSound.play(); // Play restore sound
            enlargedImageContainer.remove();
        });
    });

    // Handle click for text description divs
    $('body').on('click', 'div.popupable', function () {
        clickSound.play(); // Play click sound

        const textContent = $(this).text();
        const enlargedContent = $('<div>').addClass('enlarged-content');
        const closeButton = $('<span>').addClass('close-button').text('✖');

        enlargedContent.text(textContent);
        enlargedContent.append(closeButton);
        $('body').append(enlargedContent);

        closeButton.click(function () {
            restoreSound.play(); // Play restore sound
            enlargedContent.removeClass('active'); // Remove the 'active' class
            setTimeout(() => enlargedContent.remove(), 500); // Remove after 500ms (adjust if needed)
        });

        // Add the 'active' class to show the enlarged content
        setTimeout(() => enlargedContent.addClass('active'), 50); // Add after 50ms (adjust if needed)
    });
});
