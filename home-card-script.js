$(document).ready(function () {
    // Function to fetch cards from the API
    function fetchCards() {
      // Make AJAX request to the API
      $.ajax({
        url: `http://3.26.226.77:5000/getCards`,
        type: 'GET',
        success: function (response) {
          displayCards(response.cards);
        },
        error: function (error) {
          console.log('Error fetching cards:', error);
        }
      });
    }
  
    // Function to dynamically display cards on the HTML page
    function displayCards(cards) {
      const container = $('.card-container');
      container.empty(); // Clear existing content
  
      cards.forEach((card, index) => {
        const cardDiv = $('<div>').addClass('card');
        const image = $('<img>').addClass('card-image').attr('src', card.cx_image_url).attr('alt', 'Card Image');
        const secondaryImage = $('<img>').addClass('card-image-secondary').attr('src', card.cx_image_url).attr('alt', 'Card Image');
        const contentDiv = $('<div>').addClass('card-content');
        const name = $('<h3>').addClass('card-title').text(card.cx_name);
        const description = $('<p>').addClass('card-description').text(card.cx_description);
  
        contentDiv.append(name, description);
        cardDiv.append(image, secondaryImage, contentDiv);
        container.append(cardDiv);
      });
    }
  
    // Fetch cards when the document is ready
    fetchCards();
  });
  