// Function to generate random dates
function getRandomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

// Function to create flip clock UI
function createFlipClockUI() {
  const flipClockContainer = document.createElement('div');
  flipClockContainer.id = 'flip-clock';
  document.body.appendChild(flipClockContainer);
  flipClockContainer.innerHTML = '<div class="flip" id="day"></div><div class="flip" id="month"></div><div class="flip" id="year"></div>';

  // Add mouseover event listeners
  flipClockContainer.addEventListener('mouseover', () => {
      flipClockContainer.style.opacity = '0.25';
  });

  flipClockContainer.addEventListener('mouseout', () => {
      flipClockContainer.style.opacity = '0.98';
  });
}

// Function to update flip clock with a random date
function updateFlipClock() {
  const dateString = getRandomDate(-20000, 2025);
  const [year, month, day] = dateString.split('-');
  document.getElementById('day').textContent = day;
  document.getElementById('month').textContent = month;
  document.getElementById('year').textContent = year;
}

// Function to start the flip clock with random intervals
function startFlipClock() {
  createFlipClockUI();
  updateFlipClock();
  setInterval(updateFlipClock, Math.random() * (4600 - 400) + 400); // Update every 0.4 to 4.6 seconds
}

// Call startFlipClock when the window loads and adjust the position based on the header
window.addEventListener('load', () => {
  const header = document.getElementById('header-placeholder');
  startFlipClock();
  const flipClock = document.getElementById('flip-clock');
  const headerHeight = header.offsetHeight;
  flipClock.style.top = `${headerHeight + 20}px`; // Adjusts position below the header
});