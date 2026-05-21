const questions = [
  {
    text: "Qual lugar parece mais confortavel pra voce?",
    options: [
      { label: "Um quarto iluminado por CRT as 2 da manha", type: "echo" },
      { label: "Uma locadora vazia em dia de chuva", type: "static" },
      { label: "Um fliperama antigo quase abandonado", type: "player" },
      { label: "Um onibus voltando pra casa ouvindo musica", type: "lost" }
    ]
  },
  {
    text: "Quando voce joga algo antigo... o que realmente sente?",
    options: [
      { label: "Saudade de quem eu era", type: "lost" },
      { label: "Vontade de desaparecer naquele mundo", type: "player" },
      { label: "Conforto", type: "echo" },
      { label: "Nada especifico, so silencio", type: "static" }
    ]
  },
  {
    text: "Qual dessas imagens parece mais viva?",
    options: [
      { label: "Luzes neon refletindo no asfalto molhado", type: "static" },
      { label: "Uma TV de tubo ligada sem som", type: "echo" },
      { label: "Uma janela aberta durante a madrugada", type: "player" },
      { label: "Um save antigo encontrado por acaso", type: "lost" }
    ]
  },
  {
    text: "Voce acha que nostalgia e...",
    options: [
      { label: "Uma forma de fugir", type: "player" },
      { label: "Uma memoria corrompida", type: "static" },
      { label: "Uma segunda casa", type: "echo" },
      { label: "Algo perigoso", type: "lost" }
    ]
  },
  {
    text: "Se pudesse voltar para uma epoca especifica...",
    options: [
      { label: "Primeira vez jogando online", type: "player" },
      { label: "Infancia depois da escola", type: "echo" },
      { label: "Noites assistindo anime escondido", type: "static" },
      { label: "Eu nao voltaria", type: "lost" }
    ]
  },
  {
    text: "O que mais assusta voce?",
    options: [
      { label: "Esquecer", type: "lost" },
      { label: "Ser esquecido", type: "static" },
      { label: "Nunca mudar", type: "echo" },
      { label: "Mudar demais", type: "player" }
    ]
  },
  {
    text: "Se DAIKI.exe fosse um lugar... ele seria?",
    options: [
      { label: "Um sistema operacional perdido", type: "static" },
      { label: "Um quarto preso no tempo", type: "echo" },
      { label: "Um save corrompido de infancia", type: "lost" },
      { label: "Um sonho digital impossivel de revisitar", type: "player" }
    ]
  }
];

const resultTypes = {
  echo: {
    title: "MEMORY TYPE: ECHO",
    description: "Voce transforma lembrancas em abrigo. O sistema encontrou uma casa dentro do ruido."
  },
  static: {
    title: "MEMORY TYPE: STATIC",
    description: "Algumas partes suas ainda vivem em lugares que ja acabaram. A transmissao falha, mas nao some."
  },
  player: {
    title: "MEMORY TYPE: PLAYER TWO",
    description: "Voce sente mais conforto em mundos ficticios do que no real. Talvez voce nunca tenha jogado sozinho."
  },
  lost: {
    title: "MEMORY TYPE: LOST SAVE",
    description: "Voce continua tentando recuperar uma versao antiga de si mesmo. O arquivo existe, mas mudou de nome."
  }
};

const intermissionLines = [
  "syncing memories...",
  "loading emotional archive...",
  "fragment recovered...",
  "checking corrupted feelings...",
  "rebuilding user profile...",
  "searching old save data...",
  "sync complete?"
];

const analyzeLines = [
  "analyzing memory fragments...",
  "building emotional profile...",
  "cross-reading nostalgia patterns...",
  "sync complete."
];

const state = {
  index: 0,
  scores: {
    echo: 0,
    static: 0,
    player: 0,
    lost: 0
  },
  audioEnabled: false,
  audio: null,
  locked: false,
  analyzeTimer: null
};

const questionPanel = document.getElementById("questionPanel");
const analyzePanel = document.getElementById("analyzePanel");
const resultPanel = document.getElementById("resultPanel");
const questionIndex = document.getElementById("questionIndex");
const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const progressLabel = document.getElementById("progressLabel");
const statusLine = document.getElementById("statusLine");
const memoryLog = document.getElementById("memoryLog");
const analyzeLine = document.getElementById("analyzeLine");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const restartTest = document.getElementById("restartTest");
const retakeTest = document.getElementById("retakeTest");
const audioToggle = document.getElementById("audioToggle");
const screenFlash = document.getElementById("screenFlash");
const railNodes = document.querySelectorAll(".rail-node");

function renderQuestion() {
  const question = questions[state.index];

  state.locked = false;
  questionIndex.textContent = String(state.index + 1).padStart(2, "0");
  questionText.textContent = question.text;
  progressLabel.textContent = `FRAGMENT ${String(state.index + 1).padStart(2, "0")}/07`;
  updateProgressRail(state.index);
  statusLine.textContent = intermissionLines[state.index % intermissionLines.length];
  memoryLog.textContent = "Uma memoria esta sendo acessada. Escolha o fragmento que parece mais verdadeiro.";
  optionsList.innerHTML = "";

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");

    button.className = "option-button";
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + optionIndex)}) ${option.label}`;
    button.addEventListener("click", () => chooseOption(option));
    optionsList.appendChild(button);
  });

  questionPanel.classList.remove("hidden");
  analyzePanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
}

function chooseOption(option) {
  if (state.locked) return;

  state.locked = true;
  state.scores[option.type] += 1;
  memoryLog.textContent = intermissionLines[(state.index + 1) % intermissionLines.length];
  playBeep(360 + state.index * 35, 0.08, 0.026);
  triggerGlitch();
  questionPanel.classList.add("is-changing");

  window.setTimeout(() => {
    questionPanel.classList.remove("is-changing");
    state.index += 1;

    if (state.index >= questions.length) {
      showAnalyzePanel();
      return;
    }

    renderQuestion();
  }, 520);
}

function showAnalyzePanel() {
  questionPanel.classList.add("hidden");
  analyzePanel.classList.remove("hidden");
  resultPanel.classList.add("hidden");
  progressLabel.textContent = "PROFILE BUILD";
  updateProgressRail(questions.length);
  memoryLog.textContent = "O sistema esta juntando os fragmentos em uma identidade temporaria.";

  let step = 0;
  analyzeLine.textContent = analyzeLines[step];
  playBeep(220, 0.14, 0.028);

  state.analyzeTimer = window.setInterval(() => {
    step += 1;

    if (step >= analyzeLines.length) {
      window.clearInterval(state.analyzeTimer);
      state.analyzeTimer = null;
      showResult();
      return;
    }

    analyzeLine.textContent = analyzeLines[step];
    triggerGlitch();
    playBeep(260 + step * 80, 0.1, 0.024);
  }, 900);
}

function showResult() {
  const result = calculateResult();

  state.locked = false;
  analyzePanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  resultTitle.textContent = result.title;
  resultDescription.textContent = result.description;
  progressLabel.textContent = "PROFILE COMPLETE";
  updateProgressRail(questions.length);
  statusLine.textContent = "welcome back, daiki.";
  memoryLog.textContent = "O visitante foi sincronizado com o sistema. Nome temporario: Daiki.";
  playBeep(740, 0.22, 0.034);
}

function calculateResult() {
  const entries = Object.entries(state.scores);

  entries.sort((a, b) => b[1] - a[1]);

  return resultTypes[entries[0][0]];
}

function resetQuiz() {
  if (state.analyzeTimer) {
    window.clearInterval(state.analyzeTimer);
    state.analyzeTimer = null;
  }

  state.index = 0;
  state.locked = false;
  state.scores.echo = 0;
  state.scores.static = 0;
  state.scores.player = 0;
  state.scores.lost = 0;
  renderQuestion();
}

function updateProgressRail(currentIndex) {
  railNodes.forEach((node, index) => {
    node.classList.toggle("is-current", index === currentIndex && currentIndex < questions.length);
    node.classList.toggle("is-complete", index < currentIndex || currentIndex >= questions.length);
  });
}

function triggerGlitch() {
  document.body.classList.add("is-glitching");
  screenFlash.classList.remove("is-active");
  void screenFlash.offsetWidth;
  screenFlash.classList.add("is-active");

  window.setTimeout(() => {
    document.body.classList.remove("is-glitching");
  }, 500);
}

function createAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const gain = context.createGain();
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = 64;
  filter.type = "lowpass";
  filter.frequency.value = 460;
  gain.gain.value = 0.015;
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
  audioToggle.textContent = state.audioEnabled ? "audio on" : "audio off";

  if (state.audioEnabled) {
    startAudio();
    playBeep(520, 0.12, 0.028);
    return;
  }

  if (state.audio) {
    state.audio.gain.gain.setTargetAtTime(0, state.audio.context.currentTime, 0.08);
  }
}

function playBeep(frequency, duration, volume) {
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

document.addEventListener("mousemove", (event) => {
  document.body.style.setProperty("--mx", `${event.clientX}px`);
  document.body.style.setProperty("--my", `${event.clientY}px`);
});

restartTest.addEventListener("click", resetQuiz);
retakeTest.addEventListener("click", resetQuiz);
audioToggle.addEventListener("click", toggleAudio);

renderQuestion();
