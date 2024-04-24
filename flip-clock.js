// Function to generate random dates
function getRandomDate(startYear, endYear) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return {
      day: randomDate.getDate().toString().padStart(2, '0'),
      month: (randomDate.getMonth() + 1).toString().padStart(2, '0'),
      year: randomDate.getFullYear().toString()
    };
  }
  
  // Function to create flip clock UI
  function createFlipClockUI() {
    const flipClockContainer = document.createElement('div');
    flipClockContainer.id = 'flip-clock';
    flipClockContainer.style.position = 'fixed';
    flipClockContainer.style.zIndex = '10'; // Adjust zIndex as needed
    flipClockContainer.style.pointerEvents = 'none'; // Ensures click through
    flipClockContainer.style.width = '100%';
    flipClockContainer.style.height = '100%';
    flipClockContainer.style.display = 'flex';
    flipClockContainer.style.justifyContent = 'center';
    flipClockContainer.style.alignItems = 'center';
    flipClockContainer.innerHTML = `
      <div class="flip" id="day"></div>
      <div class="flip" id="month"></div>
      <div class="flip" id="year"></div>
    `;
    document.body.appendChild(flipClockContainer);
  }
  
  // Function to update flip clock with a random date
  function updateFlipClock() {
    const randomDate = getRandomDate(-20000, 2025);
    document.getElementById('day').textContent = randomDate.day;
    document.getElementById('month').textContent = randomDate.month;
    document.getElementById('year').textContent = randomDate.year;
  }
  
  // Function to start the flip clock with random intervals
  function startFlipClock() {
    createFlipClockUI();
    updateFlipClock();
    setInterval(updateFlipClock, Math.random() * (4600 - 400) + 400); // Update every 0.4 to 4.6 seconds
  }
  
  // Injecting styles for the flip clock
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    #flip-clock {
        position: absolute;
        top: calc(100% + 20px); /* Adjusts the position to be 20px below the header */
        left: 0;
        transform: translateX(0%); /* Adjust this value as needed */
        pointer-events: none;
      }
    .flip {
      background: rgba(0, 0, 0, 0.7); /* Translucent background */
      color: palewhite;
      font-size: 5vw; /* Responsive font size */
      border-radius: 5px;
      padding: 20px;
      margin: 0 10px;
      display: inline-block;
      text-align: center;
      min-width: 8vw; /* Responsive width */
      transition: all 0.6s ease-in-out; /* Smooth flip animation */
      transform-style: preserve-3d; /* 3D effect for flip */
    }
    /* Add any additional styles or animations for the flip effect */
  `;
  document.head.appendChild(style);
  
  // Start the flip clock when the window loads
  window.onload = () => {
    startFlipClock(); // Make sure this function is defined in your flip clock code
  
    // Adjust the top position of the flip clock based on the header height
    const header = document.getElementById('header-placeholder');
    const flipClock = document.getElementById('flip-clock');
    const headerHeight = header.offsetHeight;
    flipClock.style.top = `${headerHeight + 20}px`; // Adjusts position below the header
  };