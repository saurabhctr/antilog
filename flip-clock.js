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
    flipClockContainer.innerHTML = `
      <div class="flip" id="day"><div class="card"><div class="top-half"></div><div class="bottom-half"></div></div></div>
      <div class="flip" id="month"><div class="card"><div class="top-half"></div><div class="bottom-half"></div></div></div>
      <div class="flip" id="year"><div class="card"><div class="top-half"></div><div class="bottom-half"></div></div></div>
    `;
  }
  
  // Function to update flip clock with a random date
  function updateFlipClock() {
    const dateString = getRandomDate(-20000, 2025);
    const [year, month, day] = dateString.split('-');
    document.getElementById('day').querySelector('.top-half').textContent = day;
    document.getElementById('month').querySelector('.top-half').textContent = month;
    document.getElementById('year').querySelector('.top-half').textContent = year;
    // Animation can be triggered here by toggling classes or other means
  }
  
  // Function to start the flip clock with random intervals
  function startFlipClock() {
    createFlipClockUI();
    updateFlipClock();
    setInterval(updateFlipClock, Math.random() * (4600 - 400) + 400); // Update every 0.4 to 4.6 seconds
  }
  
  // Call startFlipClock when the window loads
  window.addEventListener('load', startFlipClock);
  