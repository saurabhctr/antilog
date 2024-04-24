document.addEventListener("DOMContentLoaded", function() {
    // Create and append the flip clock container
    const clock = document.createElement('div');
    clock.id = 'flip-clock';
    clock.className = 'flip-clock';
    document.body.appendChild(clock);

    // Create digits for hours, minutes, and seconds
    const ids = ['hour1', 'hour2', 'minute1', 'minute2', 'second1', 'second2'];
    ids.forEach(id => {
        const digit = document.createElement('div');
        digit.className = 'digit';
        digit.id = id;
        digit.innerHTML = `<div class="top-half">0</div><div class="bottom-half">0</div>`;
        clock.appendChild(digit);
    });

    // Function to update the clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        ids.forEach((id, index) => {
            const digit = document.getElementById(id);
            const newValues = hours + minutes + seconds;
            const newValue = newValues.charAt(index);
            const topHalf = digit.querySelector('.top-half');
            const bottomHalf = digit.querySelector('.bottom-half');

            if (topHalf.textContent !== newValue) {
                topHalf.textContent = newValue;
                bottomHalf.style.transform = 'rotateX(-180deg)'; // Reset for flip
                bottomHalf.textContent = newValue; // Prepare new value for flip

                // Animate flip
                bottomHalf.style.transition = 'none'; // Disable transition for instant reset
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bottomHalf.style.transition = 'transform 0.6s';
                        bottomHalf.style.transform = 'rotateX(0deg)';
                    });
                });
            }
        });
    }

    // Make the clock draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = function(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDrag;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDrag() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makeDraggable(clock);

    // Initialize the clock and set it to update every second
    setInterval(updateClock, 1000);
    updateClock(); // Set initial time
});
