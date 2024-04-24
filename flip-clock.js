// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function() {
    // Create and append the flip clock container
    const clock = document.createElement('div');
    clock.id = 'flip-clock';
    clock.className = 'flip-clock';
    document.body.appendChild(clock);

    // Define time units and create their respective HTML structure
    const timeUnits = ['hour', 'minute', 'second'];
    timeUnits.forEach(unit => {
        for (let i = 0; i < 2; i++) {
            const digit = document.createElement('div');
            digit.className = 'digit ' + unit;
            digit.innerHTML = `<div class="card">
                                   <div class="top-half" id="${unit}${i}-top"></div>
                                   <div class="bottom-half" id="${unit}${i}-bottom"></div>
                               </div>`;
            clock.appendChild(digit);
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
