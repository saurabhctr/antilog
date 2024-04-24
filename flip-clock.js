function getRandomDate(startYear, endYear) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function createFlipClockUI() {
    const flipClockContainer = document.createElement('div');
    flipClockContainer.id = 'flip-clock';
    document.body.appendChild(flipClockContainer);
    const ids = ['day', 'month', 'year'];
    ids.forEach(id => {
        const flip = document.createElement('div');
        flip.className = 'flip';
        flip.innerHTML = `<div class="card"><div class="top-half"></div><div class="bottom-half"></div></div>`;
        flip.firstElementChild.id = id;
        flipClockContainer.appendChild(flip);
    });
    makeDraggable(flipClockContainer);
}

function updateFlipClock() {
    const dateString = getRandomDate(-20000, 2025);
    const [year, month, day] = dateString.split('-');
    const fields = {day, month, year};
    for (const [id, value] of Object.entries(fields)) {
        const topHalf = document.getElementById(id).querySelector('.top-half');
        const bottomHalf = document.getElementById(id).querySelector('.bottom-half');
        if (topHalf.textContent !== value) {
            topHalf.textContent = value;
            bottomHalf.textContent = value; // Prepare for next flip
            // Trigger flip
            bottomHalf.style.transform = 'rotateX(0deg)';
            setTimeout(() => {
                bottomHalf.style.transform = 'rotateX(180deg)';
            }, 300); // Halfway through the flip, reset position
        }
    }
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e =e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Call startFlipClock when the window loads
window.addEventListener('load', startFlipClock);
