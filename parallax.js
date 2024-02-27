let lastScroll = 0;

function animateShapes() {
    const scrollPosition = window.scrollY;
    const shapes = document.querySelectorAll('.vector-shape');

    shapes.forEach(shape => {
        const speed = 0.5; // Base speed for movement
        const direction = scrollPosition > lastScroll ? 1 : -1; // Determine scroll direction
        const rotation = direction * (scrollPosition * 0.05); // Adjust rotation based on direction
        const tilt = direction * 5; // Tilt angle

        shape.style.transform = `translateY(${scrollPosition * speed}px) rotate(${rotation}deg) skew(${tilt}deg)`;
    });

    lastScroll = scrollPosition; // Update last scroll position
    requestAnimationFrame(animateShapes); // Continue the animation on the next frame
}

window.addEventListener('load', animateShapes); // Start animation when the page is loaded
