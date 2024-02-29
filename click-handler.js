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

        // Handle a second click on the enlarged image
        enlargedImage.one('click', function () {
            // Play restore sound
            restoreSound.play();

            // Remove the 'enlarged' class after the restore sound is played
            setTimeout(function () {
                enlargedImageContainer.removeClass('enlarged');
            }, restoreSound.duration * 1000);
        });
    });
});
