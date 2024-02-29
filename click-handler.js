$(document).ready(function () {
    // Handle click for images
    $('body').on('click', 'img.enlargeable', function () {
        const imageUrl = $(this).attr('src');
        const enlargedImageContainer = $('<div>').addClass('enlarged-image-container');
        const enlargedImage = $('<img>').addClass('enlarged-image').attr('src', imageUrl).attr('alt', 'Enlarged Image');

        enlargedImageContainer.append(enlargedImage);
        $('body').append(enlargedImageContainer);

        enlargedImageContainer.click(function () {
            enlargedImageContainer.remove();
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

        closeButton.click(function () {
            enlargedContent.remove();
        });
    });
});
