// ─── GLOBALE FAVORITEN FUNKTIONEN ────────────────────────────────────
function getFavorites() {
  return JSON.parse(localStorage.getItem('viberoll_favorites') || '[]');
}

function saveFavorites(favs) {
  localStorage.setItem('viberoll_favorites', JSON.stringify(favs));
}

function isFavorite(gameId) {
  return getFavorites().includes(gameId);
}

function toggleFavorite(gameId) {
  const favs = getFavorites();
  const idx  = favs.indexOf(gameId);
  if (idx === -1) {
    favs.push(gameId);
  } else {
    favs.splice(idx, 1);
  }
  saveFavorites(favs);
  return favs.includes(gameId);
}

// ─── FAVORITEN SEITE RENDERN ──────────────────────────────────────────
function renderFavoritesPage() {
  const favEmpty   = document.getElementById('favEmpty');
  const favGrid    = document.getElementById('favGrid');
  const favActions = document.getElementById('favActions');
  if (!favGrid) return;

  const favIds   = getFavorites();
  const favGames = favIds.map(id => games.find(g => g.id === id)).filter(Boolean);

  if (favGames.length === 0) {
    favEmpty.classList.add('visible');
    favGrid.innerHTML = '';
    if (favActions) favActions.style.display = 'none';
    return;
  }

  favEmpty.classList.remove('visible');
  if (favActions) favActions.style.display = 'block';

  const thumbEmojis = {
    action:'⚔️',rpg:'🧙',shooter:'🔫',strategy:'♟️',simulation:'🌾',
    puzzle:'🧩',platformer:'🏃',horror:'👻',sport:'⚽',racing:'🏎️',
    indie:'🎨',sandbox:'⛏️',roguelite:'🎲',party:'🎉',adventure:'🗺️'
  };

  favGrid.innerHTML = '';
  favGames.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <div class="game-card-thumb">${thumbEmojis[game.genre[0]] || '🎮'}</div>
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-meta"><span class="rating">★ ${game.rating}</span> · ${game.genre[0]}</div>
        <div class="game-card-tags">
          ${game.vibe.slice(0,2).map(v=>`<span class="tag tag-accent">${v}</span>`).join('')}
        </div>
      </div>
      <div class="fav-card-actions">
        <button class="fav-remove-btn" onclick="removeFavorite(${game.id})">Entfernen</button>
        <button class="fav-view-btn" onclick="viewGame(${game.id})">Ansehen</button>
      </div>
    `;
    favGrid.appendChild(card);
  });
}

function removeFavorite(gameId) { toggleFavorite(gameId); renderFavoritesPage(); }

function viewGame(gameId) {
  const game = games.find(g => g.id === gameId);
  if (!game) return;
  localStorage.setItem('viberoll_result', JSON.stringify(game));
  window.location.href = 'results.html';
}

function clearAllFavorites() {
  if (confirm('Alle Favoriten wirklich löschen?')) {
    saveFavorites([]);
    renderFavoritesPage();
  }
}

document.getElementById('navToggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

renderFavoritesPage();