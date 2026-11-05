document.addEventListener('DOMContentLoaded', () => {
    async function fetchGameData() {
      const query = document.getElementById('gameQuery').value.trim();
      const results = document.getElementById('results');

      if (!query) {
        results.innerHTML = '<div class="col-12 text-center py-4"><p class="text-warning">Please enter a game name to search.</p></div>';
        return;
      }

      results.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-info" role="status"></div><p class="text-secondary mt-2">Searching CheapShark API...</p></div>';

      try {
        const game_data = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const games = await game_data.json();
        
        const deals_data = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(query)}`);
        const deals = await deals_data.json();

        if (games.length === 0 && deals.length === 0) {
          results.innerHTML = '<div class="col-12 text-center py-4"><p class="text-secondary">No games found matching that title.</p></div>';
          return;
        }

        // Map deals by lowercase title for clean matching
        const dealMap = new Map();
        deals.forEach(deal => {
          const key = deal.title.toLowerCase().trim();
          if (!dealMap.has(key)) {
            dealMap.set(key, deal);
          }
        });

        // Render card items
        results.innerHTML = games.slice(0, 6).map(game => {
          const gameKey = game.external.toLowerCase().trim();
          const matchDeal = dealMap.get(gameKey) || {};

          const normalPrice = matchDeal.normalPrice ? `$${matchDeal.normalPrice}` : '';
          const salePrice = matchDeal.salePrice ? `$${matchDeal.salePrice}` : `$${game.cheapest || 'N/A'}`;
          const isOnSale = matchDeal.isOnSale === "1";
          const savings = matchDeal.savings ? `${Math.round(parseFloat(matchDeal.savings))}% OFF` : '';
          const metacriticScore = matchDeal.metacriticScore && matchDeal.metacriticScore !== "0" ? `${matchDeal.metacriticScore}/100` : 'N/A';
          
          let releaseDate = 'N/A';
          if (matchDeal.releaseDate && matchDeal.releaseDate > 0) {
            releaseDate = new Date(matchDeal.releaseDate * 1000).toLocaleDateString();
          }

          return `
            <div class="col">
              <div class="steam-card-vertical h-100 d-flex flex-column rounded-3 border border-secondary border-opacity-25 overflow-hidden">
                
                <div class="card-img-wrapper">
                  <img src="${game.thumb}" alt="${game.external}" class="img-fluid w-100 game-thumb" style="height: 140px; object-fit: cover;">
                </div>

                <div class="p-3 d-flex flex-column flex-grow-1 justify-content-between bg-dark bg-gradient">
                  <div>
                    <h3 class="h6 mb-2 fw-bold">
                      <a href="https://store.steampowered.com/app/${game.steamAppID}" target="_blank" rel="noopener noreferrer" class="steam-title-link text-decoration-none text-light">
                        ${game.external}
                      </a>
                    </h3>
                  </div>

                  <div class="pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2 text-secondary">
                      <i class="bi bi-windows platform-icon" title="Windows"></i>
                      <i class="bi bi-apple platform-icon" title="macOS"></i>
                      <span class="deck-badge text-success small" title="Steam Deck Verified">
                        <i class="bi bi-check-circle-fill"></i> <i class="bi bi-controller"></i>
                      </span>
                    </div>

                    <!-- Pass deal attributes to Modal -->
                    <button type="button" 
                            class="btn btn-sm btn-outline-info rounded-pill px-3 py-1 text-uppercase fw-semibold btn-more-info"
                            data-bs-toggle="modal" 
                            data-bs-target="#gameInfoModal"
                            data-title="${game.external.replace(/"/g, '&quot;')}"
                            data-img="${game.thumb}"
                            data-saleprice="${salePrice}"
                            data-normalprice="${normalPrice}"
                            data-isonsale="${isOnSale}"
                            data-savings="${savings}"
                            data-metacritic="${metacriticScore}"
                            data-releasedate="${releaseDate}"
                            data-steamid="${game.steamAppID}">
                      More Info
                    </button>
                  </div>
                </div>

              </div>
            </div>
          `;
        }).join('');

      } catch (error) {
        console.error('Error fetching game data:', error);
        results.innerHTML = '<div class="col-12 text-center py-4"><p class="text-danger">Failed to retrieve game information. Check your internet connection.</p></div>';
      }
    }

    const search_button = document.getElementById("steam-search-btn");
    if (search_button) {
      search_button.addEventListener("click", fetchGameData);
    }

    const gameQueryInput = document.getElementById('gameQuery');
    if (gameQueryInput) {
      gameQueryInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') fetchGameData();
      });
    }

    // Populate Modal window on click
    const gameInfoModal = document.getElementById('gameInfoModal');
    if (gameInfoModal) {
      gameInfoModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        
        const title = button.getAttribute('data-title') || 'Game Details';
        const img = button.getAttribute('data-img') || '';
        const salePrice = button.getAttribute('data-saleprice') || 'N/A';
        const normalPrice = button.getAttribute('data-normalprice') || '';
        const isOnSale = button.getAttribute('data-isonsale') === 'true';
        const savings = button.getAttribute('data-savings') || '';
        const metacritic = button.getAttribute('data-metacritic') || 'N/A';
        const releaseDate = button.getAttribute('data-releasedate') || 'N/A';
        const steamId = button.getAttribute('data-steamid') || '';

        document.getElementById('modalGameTitle').textContent = title;
        document.getElementById('modalGameImg').src = img;
        document.getElementById('modalGamePrice').textContent = salePrice;
        
        const normalPriceEl = document.getElementById('modalGameNormalPrice');
        if (normalPriceEl) {
          normalPriceEl.textContent = (isOnSale && normalPrice && normalPrice !== salePrice) ? normalPrice : '';
        }

        const savingsEl = document.getElementById('modalGameSavings');
        if (savingsEl) {
          if (isOnSale && savings) {
            savingsEl.textContent = savings;
            savingsEl.style.display = 'inline-block';
          } else {
            savingsEl.style.display = 'none';
          }
        }

        const metacriticEl = document.getElementById('modalGameMetacritic');
        if (metacriticEl) metacriticEl.textContent = metacritic;

        const releaseDateEl = document.getElementById('modalGameReleaseDate');
        if (releaseDateEl) releaseDateEl.textContent = releaseDate;

        const steamBtn = document.getElementById('modalSteamBtn');
        if (steamBtn) {
          steamBtn.href = steamId ? `https://store.steampowered.com/app/${steamId}` : '#';
        }
      });
    }
});