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
        const response = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const games = await response.json();
        if (games.length === 0) {
          results.innerHTML = '<div class="col-12 text-center py-4"><p class="text-secondary">No games found matching that title.</p></div>';
          return;
        }
        
        // Render top 6 game results using the updated Steam-style card design
        results.innerHTML = games.slice(0, 6).map(game => `
          <div class="col">
            <div class="steam-card-vertical h-100 d-flex flex-column rounded-3 border border-secondary border-opacity-25 overflow-hidden">
              
              <div class="card-img-wrapper position-relative">
                <img src="${game.thumb}" alt="${game.external}" class="img-fluid w-100 game-thumb" style="height: 140px; object-fit: cover;">
                <span class="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-info border border-info border-opacity-50">
                  From $${game.cheapest || 'N/A'}
                </span>
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
                  <!-- Platform Icons -->
                  <div class="d-flex align-items-center gap-2 text-secondary">
                    <i class="bi bi-windows platform-icon" title="Windows"></i>
                    <i class="bi bi-apple platform-icon" title="macOS"></i>
                    <span class="deck-badge text-success small" title="Steam Deck Verified">
                      <i class="bi bi-check-circle-fill"></i> <i class="bi bi-controller"></i>
                    </span>
                  </div>

                  <!-- Dynamic Modal Trigger -->
                  <button type="button" 
                          class="btn btn-sm btn-outline-info rounded-pill px-3 py-1 text-uppercase fw-semibold btn-more-info"
                          data-bs-toggle="modal" 
                          data-bs-target="#gameInfoModal"
                          data-title="${game.external.replace(/"/g, '&quot;')}"
                          data-img="${game.thumb}"
                          data-price="$${game.cheapest || 'N/A'}"
                          data-steamid="${game.steamAppID}">
                    More Info
                  </button>
                </div>
              </div>

            </div>
          </div>
        `).join('');

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

    // Modal data populator logic
    const gameInfoModal = document.getElementById('gameInfoModal');
    if (gameInfoModal) {
      gameInfoModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const title = button.getAttribute('data-title') || 'Game Details';
        const img = button.getAttribute('data-img') || '';
        const price = button.getAttribute('data-price') || 'N/A';
        const steamId = button.getAttribute('data-steamid') || '';

        document.getElementById('modalGameTitle').textContent = title;
        document.getElementById('modalGameImg').src = img;
        document.getElementById('modalGamePrice').textContent = price;
        
        const modalSteamBtn = document.getElementById('modalSteamBtn');
        if (modalSteamBtn) {
          modalSteamBtn.href = steamId ? `https://store.steampowered.com/app/${steamId}` : '#';
        }
      });
    }

    const dealsBtn = document.getElementById('toggle-deals-btn');
    const searchBtn = document.getElementById('toggle-search-btn');
    const dealsPane = document.getElementById('deals-pane');
    const searchPane = document.getElementById('search-pane');

    if (dealsBtn && searchBtn) {
      dealsBtn.addEventListener('click', () => {
        dealsBtn.classList.add('active');
        searchBtn.classList.remove('active');
        if (dealsPane) dealsPane.classList.remove('d-none');
        if (searchPane) searchPane.classList.add('d-none');
      });

      searchBtn.addEventListener('click', () => {
        searchBtn.classList.add('active');
        dealsBtn.classList.remove('active');
        if (searchPane) searchPane.classList.remove('d-none');
        if (dealsPane) dealsPane.classList.add('d-none');
      });
    }
});