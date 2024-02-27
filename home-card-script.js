document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('dummy-content');
    for (let row = 0; row < 7; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'card-row';
        for (let col = 0; col < 3; col++) {
            const card = document.createElement('div');
            card.className = 'dummy-card';
            
            const image = document.createElement('img');
            image.src = 'https://via.placeholder.com/100';
            image.alt = 'Placeholder Image';
            
            const text = document.createElement('p');
            text.textContent = `Card ${row * 3 + col + 1} Content`;
            
            card.appendChild(image);
            card.appendChild(text);
            rowDiv.appendChild(card);
        }
        container.appendChild(rowDiv);
    }
});
