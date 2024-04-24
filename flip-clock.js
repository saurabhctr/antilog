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

        for (let i = 0; i < newTime.length; i++) {
            const topHalf = document.getElementById(timeUnits[Math.floor(i / 2)] + (i % 2) + '-top');
            const bottomHalf = document.getElementById(timeUnits[Math.floor(i / 2)] + (i % 2) + '-bottom');
            if (topHalf.textContent !== newTime[i]) {
                topHalf.textContent = newTime[i];
                topHalf.classList.add('flip');
                setTimeout(() => {
                    topHalf.classList.remove('flip');
                    bottomHalf.textContent = newTime[i];
                }, 500);
            }
        }
    }

    // Update the clock every second
    setInterval(updateClock, 1000);
});
