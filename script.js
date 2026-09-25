let games = JSON.parse(localStorage.getItem('games')) || [];

const gamesContainer = document.getElementById('gamesContainer');
const noGamesMessage = document.getElementById('noGames');
const addGameBtn = document.getElementById('addGameBtn');
const addGameModal = document.getElementById('addGameModal');
const closeModalBtn = document.querySelector('.close');
const gameForm = document.getElementById('gameForm');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const starRatingInput = document.getElementById('starRatingInput');
const gameRatingInput = document.getElementById('gameRating');
const ratingDisplay = document.getElementById('ratingDisplay');

addGameBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', closeModalOnOutside);
gameForm.addEventListener('submit', addGame);
searchInput.addEventListener('input', filterGames);
genreFilter.addEventListener('change', filterGames);

const stars = starRatingInput.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', selectRating);
    star.addEventListener('mouseenter', hoverRating);
});
starRatingInput.addEventListener('mouseleave', resetHover);
displayGames(games);

function openModal() {
    addGameModal.style.display = 'block';
    document.body.classList.add('modal-open');
    gameForm.reset();
    gameRatingInput.value = '';
    ratingDisplay.textContent = 'No rating selected';
    resetStars();
}

function closeModal() {
    addGameModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

function closeModalOnOutside(event) {
    if (event.target === addGameModal) closeModal();
}

function selectRating(e) {
    const ratingValue = e.target.getAttribute('data-value');
    gameRatingInput.value = ratingValue;
    updateStarDisplay(ratingValue);
    ratingDisplay.textContent = `Rating: ${ratingValue}/10`;
}

function hoverRating(e) {
    updateStarDisplay(e.target.getAttribute('data-value'), 'hovered');
}

function resetHover() {
    const currentValue = gameRatingInput.value;
    currentValue ? updateStarDisplay(currentValue) : resetStars();
}

function updateStarDisplay(value, className = 'active') {
    stars.forEach(star => {
        const starValue = star.getAttribute('data-value');
        if (starValue <= value) {
            star.classList.add(className);
            star.classList.remove(className === 'active' ? 'hovered' : 'active');
        } else star.classList.remove('active', 'hovered');
    });
}

function resetStars() {
    stars.forEach(star => star.classList.remove('active', 'hovered'));
}

function addGame(event) {
    event.preventDefault();
    if (!gameRatingInput.value) {
        alert('Please select a rating!');
        return;
    }
    const game = {
        id: Date.now(),
        title: document.getElementById('gameTitle').value,
        genre: document.getElementById('gameGenre').value,
        image: document.getElementById('gameImage').value || 'https://via.placeholder.com/280x200?text=No+Image',
        description: document.getElementById('gameDescription').value,
        rating: parseInt(gameRatingInput.value),
        review: document.getElementById('gameReview').value
    };
    games.unshift(game);
    saveGames();
    displayGames(games);
    closeModal();
}

function deleteGame(id) {
    games = games.filter(game => game.id !== id);
    saveGames();
    displayGames(games);
}

function saveGames() {
    localStorage.setItem('games', JSON.stringify(games));
}

function displayGames(gamesToDisplay) {
    gamesContainer.innerHTML = '';
    if (gamesToDisplay.length === 0) {
        noGamesMessage.style.display = 'block';
        return;
    }
    noGamesMessage.style.display = 'none';
    gamesToDisplay.forEach(game => {
        const stars = '⭐'.repeat(Math.round(game.rating / 2));
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="game-image" onerror="this.src='https://via.placeholder.com/280x200?text=No+Image'">
            <div class="game-content">
                <div class="game-title">${game.title}</div>
                <span class="game-genre">${game.genre}</span>
                <div class="game-rating">${game.rating}/10 <div class="stars">${stars}</div></div>
                ${game.description ? `<div class="game-description">${game.description}</div>` : ''}
                ${game.review ? `<div class="game-review">"${game.review}"</div>` : ''}
                <button class="delete-btn" onclick="deleteGame(${game.id})">Delete</button>
            </div>`;
        gamesContainer.appendChild(gameCard);
    });
}

function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    displayGames(games.filter(game => game.title.toLowerCase().includes(searchTerm) && (selectedGenre === '' || game.genre === selectedGenre)));
}
