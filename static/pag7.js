const memoryItems = [
  {
    id: "controle",
    title: "CONTROL_02.EXE",
    image: "../static/Imagens/controle.png",
    phrase: "Algumas fases nunca terminam."
  },
  {
    id: "manga",
    title: "MANGA_LOG.EXE",
    image: "../static/Imagens/manga.png",
    phrase: "Eu aprendi sentimentos atraves de personagens ficticios."
  },
  {
    id: "asma",
    title: "BREATH.DLL",
    image: "../static/Imagens/asma.png",
    phrase: "Eu lembro do som da respiracao antes de dormir."
  },
  {
    id: "poster",
    title: "POSTER_WORLD.EXE",
    image: "../static/Imagens/psote.png",
    phrase: "Eu queria morar dentro daquele mundo."
  }
];

const grid = document.getElementById("memoryGrid");
const message = document.getElementById("memoryMessage");
const movesCount = document.getElementById("movesCount");
const pairsCount = document.getElementById("pairsCount");
const resetGame = document.getElementById("resetGame");
const soundToggle = document.getElementById("soundToggle");
const hitFlash = document.getElementById("hitFlash");
const finalOverlay = document.getElementById("finalOverlay");
const finalFolder = document.getElementById("finalFolder");
const finalMessage = document.getElementById("finalMessage");
const finalQuestion = document.getElementById("finalQuestion");
const finalReset = document.getElementById("finalReset");

const state = {
  deck: [],
  openCards: [],
  lockBoard: false,
  moves: 0,
  pairs: 0,
  audioEnabled: false,
  audio: null
};

function shuffle(cards) {
  return cards
    .map((card) => ({ card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ card }) => card);
}

function createDeck() {
  return shuffle(
    memoryItems.flatMap((item) => [
      { ...item, uid: `${item.id}-a` },
      { ...item, uid: `${item.id}-b` }
    ])
  );
}

function renderDeck() {
  grid.innerHTML = "";

  state.deck.forEach((card, index) => {
    const button = document.createElement("button");
    const corrupted = Math.random() > 0.72;
    const archiveName = `MEMORY_${String(index + 1).padStart(2, "0")}.EXE`;

    button.className = `memory-card${corrupted ? " is-corrupted" : ""}`;
    button.type = "button";
    button.dataset.id = card.id;
    button.dataset.uid = card.uid;
    button.setAttribute("aria-label", `Abrir ${archiveName}`);
    button.innerHTML = `
      <span class="card-inner">
        <span class="card-face card-front">
          <span class="file-name">${archiveName}</span>
          <span class="file-meta">fragment // locked</span>
        </span>
        <span class="card-face card-back">
          <img src="${card.image}" alt="">
          <span class="card-label">${card.title}</span>
        </span>
      </span>
    `;

    button.addEventListener("click", () => flipCard(button));
    grid.appendChild(button);
  });
}

function flipCard(card) {
  if (state.lockBoard || card.classList.contains("is-open") || card.classList.contains("is-matched")) {
    return;
  }

  startAudio();
  playClick();
  card.classList.add("is-open");
  state.openCards.push(card);

  if (state.openCards.length === 2) {
    state.moves += 1;
    updateHud();
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = state.openCards;
  const isMatch = first.dataset.id === second.dataset.id;

  if (isMatch) {
    handleMatch(first, second);
    return;
  }

  state.lockBoard = true;
  window.setTimeout(() => {
    first.classList.remove("is-open");
    second.classList.remove("is-open");
    state.openCards = [];
    state.lockBoard = false;
    message.textContent = "A memoria falhou. Tente abrir o arquivo de novo.";
  }, 850);
}

function handleMatch(first, second) {
  const item = memoryItems.find((memory) => memory.id === first.dataset.id);

  first.classList.add("is-matched");
  second.classList.add("is-matched");
  first.disabled = true;
  second.disabled = true;
  state.openCards = [];
  state.pairs += 1;
  message.textContent = item.phrase;
  updateHud();
  increaseDepth();
  triggerGlitch();
  playMatch();

  if (state.pairs === memoryItems.length) {
    window.setTimeout(showFinal, 900);
  }
}

function updateHud() {
  movesCount.textContent = `MOVES ${String(state.moves).padStart(2, "0")}`;
  pairsCount.textContent = `PAIRS ${state.pairs}/${memoryItems.length}`;
}

function increaseDepth() {
  const depth = state.pairs;

  document.body.dataset.depth = String(depth);
  document.body.style.setProperty("--depth", depth);
  document.body.style.setProperty("--veil-a", Math.min(0.35 + depth * 0.09, 0.72).toFixed(2));
  document.body.style.setProperty("--veil-b", Math.min(0.46 + depth * 0.08, 0.78).toFixed(2));
  document.body.style.setProperty("--grid-opacity", Math.min(0.42 + depth * 0.05, 0.66).toFixed(2));
  document.body.style.setProperty("--card-contrast", Math.min(1.05 + depth * 0.04, 1.24).toFixed(2));
}

function triggerGlitch() {
  document.body.classList.add("is-glitching");
  hitFlash.classList.remove("is-active");
  void hitFlash.offsetWidth;
  hitFlash.classList.add("is-active");

  window.setTimeout(() => {
    document.body.classList.remove("is-glitching");
  }, 600);
}

function showFinal() {
  finalOverlay.classList.remove("hidden");
  finalFolder.classList.add("hidden");
  finalMessage.classList.add("hidden");
  finalReset.classList.add("hidden");
  finalQuestion.textContent = "Voce ainda lembra?";

  window.setTimeout(() => {
    finalFolder.classList.remove("hidden");
  }, 1700);
}

function revealFinalMessage() {
  playMatch();
  finalQuestion.textContent = "childhood_final.zip";
  finalFolder.classList.add("hidden");
  finalMessage.classList.remove("hidden");
  finalReset.classList.remove("hidden");
}

function resetMemoryGame() {
  state.deck = createDeck();
  state.openCards = [];
  state.lockBoard = false;
  state.moves = 0;
  state.pairs = 0;
  message.textContent = "Encontre pares para reconstruir fragmentos da infancia do Daiki.";
  finalOverlay.classList.add("hidden");
  finalFolder.classList.add("hidden");
  finalMessage.classList.add("hidden");
  finalReset.classList.add("hidden");
  increaseDepth();
  updateHud();
  renderDeck();
}

function createAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const oscillator = context.createOscillator();

  oscillator.type = "sine";
  oscillator.frequency.value = 58;
  filter.type = "lowpass";
  filter.frequency.value = 520;
  gain.gain.value = 0.018;
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start();

  return { context, gain };
}

function startAudio() {
  if (!state.audioEnabled) return;

  if (!state.audio) {
    state.audio = createAudio();
  }

  if (state.audio && state.audio.context.state === "suspended") {
    state.audio.context.resume();
  }
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  soundToggle.textContent = state.audioEnabled ? "audio on" : "audio off";

  if (state.audioEnabled) {
    startAudio();
    playMatch();
    return;
  }

  if (state.audio) {
    state.audio.gain.gain.setTargetAtTime(0, state.audio.context.currentTime, 0.08);
  }
}

function playTone(frequency, duration, volume) {
  if (!state.audioEnabled) return;

  startAudio();

  if (!state.audio) return;

  const { context } = state.audio;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);
}

function playClick() {
  playTone(220, 0.08, 0.025);
}

function playMatch() {
  playTone(660, 0.18, 0.035);
  window.setTimeout(() => playTone(880, 0.12, 0.025), 90);
}

resetGame.addEventListener("click", resetMemoryGame);
soundToggle.addEventListener("click", toggleAudio);
finalFolder.addEventListener("click", revealFinalMessage);
finalReset.addEventListener("click", resetMemoryGame);

resetMemoryGame();
