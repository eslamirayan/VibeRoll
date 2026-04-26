// ─── FAVORITEN AUS LOCALSTORAGE ───────────────────────────────────────
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

// ─── AKTIVE NAV SEITE MARKIEREN ──────────────────────────────────────
function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.style.color = 'var(--clr-accent)';
    }
  });
}

markActiveNav();