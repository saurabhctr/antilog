$(document).ready(function () {
    const clickSound = new Audio('resources/audio/deep_click_sound.mp3');
    const restoreSound = new Audio('resources/audio/fading_air_sound.mp3');



    // Handle click for card detail page on white spaces of the card
    $('body').on('click', '.card', function (event) {
        // Extract the card_id from the clicked card
        const cardId = $(this).attr('data-card-id');

        // Open the card detail page with the correct card_id
        window.location.href = `card-detail.html?card_id=${cardId}`;
    });
});
