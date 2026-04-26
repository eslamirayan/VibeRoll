// ─── RAWG API ─────────────────────────────────────────────────────────
// WICHTIG: Diesen Key niemals auf GitHub pushen!
// Später in eine .env Datei auslagern und .gitignore hinzufügen.

const RAWG_KEY = 'b2ec2fbbeb944054ba89105f2d493ba6';
const RAWG_BASE = 'https://api.rawg.io/api';

// Cache damit wir nicht dasselbe Spiel doppelt anfragen
const imageCache = {};

// ─── EINZELNES COVER LADEN ────────────────────────────────────────────
async function fetchGameCover(title) {
  if (imageCache[title]) return imageCache[title];

  try {
    const query    = encodeURIComponent(title);
    const url      = `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${query}&page_size=1`;
    const response = await fetch(url);
    const data     = await response.json();

    if (data.results && data.results.length > 0) {
      const img = data.results[0].background_image;
      imageCache[title] = img || null;
      return img || null;
    }
  } catch (err) {
    console.warn(`RAWG: Kein Bild für "${title}"`, err);
  }

  imageCache[title] = null;
  return null;
}

// ─── BILD IN ELEMENT LADEN ────────────────────────────────────────────
async function loadCoverInto(element, title, fallbackEmoji = '🎮') {
  if (!element) return;

  // Sofort Emoji zeigen während geladen wird
  element.innerHTML = `<span class="thumb-emoji">${fallbackEmoji}</span>`;
  element.classList.add('loading');

  const imgUrl = await fetchGameCover(title);

  if (imgUrl) {
    element.innerHTML = '';
    element.style.backgroundImage = `url('${imgUrl}')`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    element.classList.remove('loading');
    element.classList.add('has-image');
  } else {
    element.classList.remove('loading');
    element.innerHTML = `<span class="thumb-emoji">${fallbackEmoji}</span>`;
  }
}

// ─── ALLE THUMBS AUF EINER SEITE LADEN ───────────────────────────────
// Ruft loadCoverInto für alle .game-card-thumb Elemente auf
async function loadAllCovers() {
  const thumbs = document.querySelectorAll('.game-card-thumb[data-title]');
  // Parallel laden aber max 5 gleichzeitig um API nicht zu überlasten
  const chunks = chunkArray([...thumbs], 5);
  for (const chunk of chunks) {
    await Promise.all(chunk.map(el =>
      loadCoverInto(el, el.dataset.title, el.dataset.emoji || '🎮')
    ));
  }
}

// ─── HELPER: Array in Chunks aufteilen ───────────────────────────────
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
