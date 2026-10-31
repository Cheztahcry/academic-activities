document.addEventListener('DOMContentLoaded', () => {
    async function fetchGameData() {
      const query = document.getElementById('gameQuery').value.trim();
      const results = document.getElementById('results');

      if (!query) {
        results.innerHTML = '<p>Please enter a game name.</p>';
        return;
      }

      results.innerHTML = '<p>Loading games...</p>';

      try {
        const response = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const games = await response.json();
        if (games.length === 0) {
          results.innerHTML = '<p>No games found matching that title.</p>';
          return;
        }
        
        // Render the top 5 game results dynamically
        results.innerHTML = games.slice(0, 5).map(game => `<div class="col">
    <div class="steam-card-vertical h-100 d-flex flex-column">
        <div class="card-img-wrapper">
            <a href="https://store.steampowered.com/app/${game.steamAppID}" 
            class="btn btn-primary fw-bold" 
            target="_blank" 
            rel="noopener noreferrer">
            View on Steam
            </a>
            <img src="${game.thumb}">
        </div>

        <div class="p-3 d-flex flex-column flex-grow-1 justify-content-between">
            <div>
                <div class="d-flex align-items-center justify-content-between mb-1">
                    <h3 class="h6 mb-0 fw-bold">
                        <a href="#" class="steam-title-link">${game.external}</a>
                    </h3>
                </div>
            </div>

            <div>
                <div class="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-windows platform-icon" title="Windows"></i>
                        <i class="bi bi-apple platform-icon" title="macOS"></i>
                        <span class="deck-badge" title="Steam Deck Verified">
                            <i class="bi bi-check-circle-fill"></i> <i class="bi bi-controller"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>`).join('');

      } catch (error) {
        console.error('Error fetching game data:', error);
        results.innerHTML = '<p>Failed to retrieve game information. Check your internet connection.</p>';
      }
    }









    async function fetchFeaturedDeals() {
    const container = document.getElementById('featuredDeals');
    container.innerHTML = '<p class="text-light">Loading top deals...</p>';

    try {
        const res = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=6');
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        
        const deals = await res.json();
        
        container.innerHTML = deals.map(deal => `
        <div class="col">
            <div class="steam-card-vertical h-100">
            <div class="card-img-wrapper">
                <img src="${deal.thumb}" alt="${deal.title}">
            </div>
            <div class="p-3">
                <h3 class="h6 text-truncate">
                <a href="https://store.steampowered.com/app/${deal.steamAppID}" target="_blank" class="steam-title-link">${deal.title}</a>
                </h3>
                <div class="steam-price-block mt-2">
                <span class="steam-discount-badge">-${Math.round(deal.savings)}%</span>
                <span class="steam-final-price">$${deal.salePrice}</span>
                </div>
            </div>
            </div>
        </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p class="text-danger">Failed to load deals.</p>';
    }
    }





    const search_button = document.getElementById("steam-search-btn")
    search_button.addEventListener("click", fetchGameData)
});