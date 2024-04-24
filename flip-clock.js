document.addEventListener("DOMContentLoaded", function() {
    // Create and append the flip clock container
    const clock = document.createElement('div');
    clock.id = 'flip-clock';
    clock.className = 'flip-clock';
    document.body.appendChild(clock);

    // Create cards for hours, minutes, and seconds
    ['hours', 'minutes', 'seconds'].forEach(unit => {
        for (let i = 0; i < 2; i++) { // Two digits per unit
            const card = createCard(unit + i);
            clock.appendChild(card);
        }
    });

    function createCard(id) {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = id;

        // Create the top and bottom halves of the card
        const topHalf = document.createElement('div');
        topHalf.className = 'top-half';
        const bottomHalf = document.createElement('div');
        bottomHalf.className = 'bottom-half';
        card.appendChild(topHalf);
        card.appendChild(bottomHalf);

        return card;
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeStr = hours + minutes + seconds;

        // Update each card
        for (let i = 0; i < 6; i++) {
            const card = document.getElementById(['hours', 'minutes', 'seconds'][Math.floor(i / 2)] + (i % 2));
            const topHalf = card.querySelector('.top-half');
            const bottomHalf = card.querySelector('.bottom-half');
            const newValue = timeStr[i];

            if (topHalf.textContent !== newValue) {
                // Prepare for the flip
                topHalf.textContent = newValue;
                bottomHalf.textContent = newValue;
                
                // Add the flip animation
                card.classList.add('flipping');
                setTimeout(() => card.classList.remove('flipping'), 950);
            }
        }
    }

    setInterval(updateClock, 1000); // Update the clock every second
});
