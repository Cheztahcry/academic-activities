document.addEventListener('DOMContentLoaded', () => {
    var games = [
        {
            gameName: "Batman: Arkham Knight",
            oldPrice: 499.95,
            currPrice: 99.99,
            gameDiscount: 80,
            gameImage: "https://cdn2.steamgriddb.com/thumb/4f2495bbd12fa12eebe41dc648f6500a.jpg",
            genres: [
                {
                    genreFirst: "Action",
                    genreSecond: "Open World",
                    genreThird: "Superhero"
                }
            ]
        },
        {
            gameName: "Grand Theft Auto V",
            oldPrice: 996.00,
            currPrice: 498.00,
            gameDiscount: 50,
            gameImage: "https://cdn2.steamgriddb.com/thumb/e68aea589393df47d1ffb43dcdbdff49.jpg",
            genres: [
                {
                    genreFirst: "Open World",
                    genreSecond: "Action",
                    genreThird: "Crime"
                }
            ]
        },
        {
            gameName: "Stardew Valley",
            oldPrice: 419.95,
            currPrice: 335.96,
            gameDiscount: 20,
            gameImage: "https://cdn2.steamgriddb.com/thumb/3bb825b7eaf65738d8850a96bcdb3532.jpg",
            genres: [
                {
                    genreFirst: "Farming Sim",
                    genreSecond: "Pixel Graphics",
                    genreThird: "Relaxing"
                }
            ]
        },
        {
            gameName: "Red Dead Redemption 2",
            oldPrice: 3399.00,
            currPrice: 849.75,
            gameDiscount: 75,
            gameImage: "https://cdn2.steamgriddb.com/thumb/36e87c365a5ddd475a82c220be840853.jpg",
            genres: [
                {
                    genreFirst: "Open World",
                    genreSecond: "Story Rich",
                    genreThird: "Western"
                }
            ]
        },
        {
            gameName: "NBA 2K27",
            oldPrice: 3490.00,
            currPrice: 2443.00,
            gameDiscount: 30,
            gameImage: "https://cdn2.steamgriddb.com/thumb/85e3916c8bf2375dff1a479b396059f0.jpg",
            genres: [
                {
                    genreFirst: "Sports",
                    genreSecond: "Basketball",
                    genreThird: "Simulation"
                }
            ]
        }
    ];
    var elParent = document.getElementById("parent");
    for (var i = 0; i < games.length; i++) {
        var curr_price = Number(games[i].currPrice);
        var old_price = Number(games[i].oldPrice);
        var discount = Number(games[i].gameDiscount);
        var genreObj = games[i].genres[0];
        elParent.innerHTML +=
            `<div class="col">
    <div class="steam-card-vertical h-100 d-flex flex-column">
        <div class="card-img-wrapper">
            <button class="wishlist-btn" title="Add to Wishlist"><i class="bi bi-plus-lg"></i></button>
            <img src="` + games[i].gameImage + `">
        </div>

        <div class="p-3 d-flex flex-column flex-grow-1 justify-content-between">
            <div>
                <div class="d-flex align-items-center justify-content-between mb-1">
                    <h3 class="h6 mb-0 fw-bold">
                        <a href="#" class="steam-title-link">` + games[i].gameName + `</a>
                    </h3>
                </div>
                
                <div class="d-flex flex-wrap gap-1 mb-3">
                    <span class="steam-tag">` + genreObj.genreFirst + `</span>
                    <span class="steam-tag">` + genreObj.genreSecond + `</span>
                    <span class="steam-tag">` + genreObj.genreThird + `</span>
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

                    <div class="steam-price-block">
                        <div class="steam-discount-badge">-` + discount + `%</div>
                        <div class="steam-price-details">
                            <span class="steam-old-price">₱` + old_price.toFixed(2) + `</span>
                            <span class="steam-final-price">₱` + curr_price.toFixed(2) + `</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>`;
    }
});