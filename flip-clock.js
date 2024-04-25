document.addEventListener("DOMContentLoaded", function() {
    const clock = document.createElement('div');
    clock.id = 'flip-clock';
    document.body.appendChild(clock);

    // Generate cards for each digit of the clock
    ['hour', 'minute', 'second'].forEach(unit => {
        for (let i = 0; i < 2; i++) {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card_clock-container';
            
            const card = document.createElement('div');
            card.className = 'card_clock';
            cardContainer.appendChild(card);
            
            const topHalf = document.createElement('div');
            topHalf.className = 'top-half';
            card.appendChild(topHalf);
            
            const bottomHalf = document.createElement('div');
            bottomHalf.className = 'bottom-half';
            card.appendChild(bottomHalf);
            
            clock.appendChild(cardContainer);
        }
    });
    

    // Function to update the clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const newTime = hours + minutes + seconds;
    
        for (let i = 0; i < 6; i++) {
            const digit = document.getElementById(['hour', 'minute', 'second'][Math.floor(i / 2)] + (i % 2));
            const newValue = newTime[i];
    
            // Only animate when the digit value changes
            if (digit.textContent !== newValue) {
                animateFlip(digit, newValue);
            }
        }
    }
    
    function animateFlip(digit, newValue) {
        const topHalf = digit.querySelector('.top-half');
        const bottomHalf = digit.querySelector('.bottom-half');
    
        // Prepare new bottom half
        const newBottomHalf = bottomHalf.cloneNode(true);
        newBottomHalf.textContent = newValue;
        newBottomHalf.style.transform = 'rotateX(180deg)';
        newBottomHalf.style.transition = 'none';
    
        // Flip top half
        topHalf.textContent = newValue;
        topHalf.style.transform = 'rotateX(-180deg)';
        topHalf.addEventListener('transitionend', () => {
            topHalf.textContent = newValue;
            topHalf.style.transform = 'rotateX(0deg)';
    
            // Replace old bottom half with the new one
            digit.replaceChild(newBottomHalf, bottomHalf);
        }, { once: true });
    }

    // Update the clock every second
    setInterval(updateClock, 1000);
});
