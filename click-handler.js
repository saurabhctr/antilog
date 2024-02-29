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

        // // Remove the container after the transition
        // setTimeout(function () {
        //     // Remove the 'enlarged' class only if it hasn't been clicked again
        //     if (!enlargedImageContainer.hasClass('clicked-again')) {
        //         restoreSound.play();
        //         enlargedImageContainer.removeClass('enlarged');
        //         // Remove the container after the restore sound is played
        //         setTimeout(function () {
        //             enlargedImageContainer.remove();
        //         }, restoreSound.duration * 1000);
        //     }
        // }, (enlargedImageContainer.hasClass('enlarged') ? 0 : 500)); // Add 500ms delay if the container is in enlarged state

        // Handle a second click on the enlarged image
        enlargedImage.click(function () {
            if (enlargedImageContainer.hasClass('enlarged')) {
                enlargedImageContainer.addClass('clicked-again');
            }
        });
    });
});
