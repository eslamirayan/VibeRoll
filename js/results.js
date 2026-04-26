const difficultyMap = {
  easy:   { label: 'Einfach',  width: '30%',  color: '#c8f135' },
  medium: { label: 'Mittel',   width: '60%',  color: '#f0a500' },
  hard:   { label: 'Schwer',   width: '90%',  color: '#f04a4a' }
};

const vibeIconMap = Object.fromEntries(vibes.map(v => [v.id, v.icon]));
const vibeLabelMap = Object.fromEntries(vibes.map(v => [v.id, v.label]));

// ─── GAME AUS LOCALSTORAGE LADEN ─────────────────────────────────────
function loadResult() {
  const raw = localStorage.getItem('viberoll_result');
  if (!raw) {
    window.location.href = 'index.html';
    return null;
  }
  return JSON.parse(raw);
}

// ─── SEITE MIT GAME BEFÜLLEN ──────────────────────────────────────────
function renderResult(game) {
  // Titel
  document.title = `${game.title} – ViberRoll`;
  document.getElementById('resultTitle').textContent = game.title;

  // Badges oben
  const badgeWrap = document.getElementById('resultBadges');
  badgeWrap.innerHTML = `
    <span class="badge badge-accent">★ ${game.rating}</span>
    <span class="badge badge-purple">${game.genre[0]}</span>
    <span class="badge badge-gray">${game.releaseYear}</span>
    <span class="badge badge-gray">${game.playTime}</span>
  `;

  // Thumb Emoji je Genre
  const thumbEmojis = {
    action: '⚔️', rpg: '🧙', shooter: '🔫', strategy: '♟️',
    simulation: '🌾', puzzle: '🧩', platformer: '🏃', horror: '👻',
    sport: '⚽', racing: '🏎️', indie: '🎨', sandbox: '⛏️',
    roguelite: '🎲', party: '🎉', adventure: '🗺️'
  };
  document.getElementById('resultThumb').textContent =
    thumbEmojis[game.genre[0]] || '🎮';

  // Detail Rows
  document.getElementById('detailPlatform').textContent =
    game.platform.map(p => p.toUpperCase()).join(', ');
  document.getElementById('detailGenre').textContent =
    game.genre.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ');
  document.getElementById('detailTime').textContent   = game.playTime;
  document.getElementById('detailDiff').textContent   = difficultyMap[game.difficulty]?.label || '–';
  document.getElementById('detailMulti').textContent  = game.multiplayer ? '✅ Ja' : '❌ Nein';
  document.getElementById('detailYear').textContent   = game.releaseYear;
  document.getElementById('detailRating').textContent = `★ ${game.rating}`;

  // Beschreibung
  document.getElementById('resultDesc').textContent = game.description;

  // Tags
  const tagsWrap = document.getElementById('resultTags');
  tagsWrap.innerHTML = game.tags
    .map(t => `<span class="result-tag">${t}</span>`)
    .join('');

  // Vibes
  const vibesWrap = document.getElementById('resultVibes');
  vibesWrap.innerHTML = game.vibe
    .map(v => `
      <span class="vibe-badge">
        ${vibeIconMap[v] || ''} ${vibeLabelMap[v] || v}
      </span>`)
    .join('');

  // Difficulty Bar
  const diff = difficultyMap[game.difficulty];
  if (diff) {
    const fill = document.getElementById('diffFill');
    fill.style.width = '0%';
    fill.style.background = diff.color;
    setTimeout(() => { fill.style.width = diff.width; }, 100);
    document.getElementById('diffLabel').textContent = diff.label;
  }

  // Favoriten Button updaten
  updateFavBtn(game.id);
}

// ─── ÄHNLICHE GAMES ───────────────────────────────────────────────────
function renderSimilar(game) {
  const similar = games
    .filter(g => g.id !== game.id && g.vibe.some(v => game.vibe.includes(v)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const grid = document.getElementById('similarGrid');
  grid.innerHTML = '';

  similar.forEach(g => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.onclick = () => {
      localStorage.setItem('viberoll_result', JSON.stringify(g));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => location.reload(), 300);
    };
    card.innerHTML = `
      <div class="game-card-thumb">🎮</div>
      <div class="game-card-body">
        <div class="game-card-title">${g.title}</div>
        <div class="game-card-meta">
          <span class="rating">★ ${g.rating}</span> · ${g.genre[0]}
        </div>
        <div class="game-card-tags">
          ${g.vibe.slice(0, 2).map(v => `<span class="tag tag-accent">${vibeLabelMap[v] || v}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── FAVORITEN ────────────────────────────────────────────────────────
function updateFavBtn(gameId) {
  const btn = document.getElementById('favoriteBtn');
  if (isFavorite(gameId)) {
    btn.textContent = '♥ In Favoriten';
    btn.style.background = 'rgba(200,241,53,0.15)';
    btn.style.color = 'var(--clr-accent)';
    btn.style.border = '1px solid rgba(200,241,53,0.3)';
  } else {
    btn.textContent = '♡ Zu Favoriten';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.border = '';
  }
}

function handleFavorite() {
  const raw  = localStorage.getItem('viberoll_result');
  if (!raw) return;
  const game = JSON.parse(raw);
  toggleFavorite(game.id);
  updateFavBtn(game.id);
}

// ─── NAV TOGGLE ───────────────────────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ─── INIT ─────────────────────────────────────────────────────────────
const currentGame = loadResult();
if (currentGame) {
  renderResult(currentGame);
  renderSimilar(currentGame);
}
