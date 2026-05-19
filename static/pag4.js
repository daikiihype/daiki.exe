const state = {
  hasSeenWindow: false,
  talkedToOldMan: false,
  helpedChild: false,
  ignoredNPCs: 0,
  nostalgiaPoints: 0,
  connectionPoints: 0,
  secretFlags: {
    foundConsole: false,
    sharedMoment: false
  },
  consoleClicks: 0,
  currentScene: "quarto",
  gameEnded: false,
  visited: {},
  gained: {}
};

const endingData = {
  room: {
    code: "FINAL 01",
    title: "VOCE NAO SAIU DO QUARTO",
    text: "Talvez eu nunca tenha realmente acordado.",
    className: "ending-room"
  },
  empty: {
    code: "FINAL 02",
    title: "CAMINHO VAZIO",
    text: "Eu cheguei... mas o momento ja tinha passado.",
    className: "ending-empty"
  },
  memory: {
    code: "FINAL 03",
    title: "MEMORIA COMPARTILHADA",
    text: "Talvez a gente nunca esteja sozinho... so fora de sincronia.",
    className: "ending-memory"
  },
  secret: {
    code: "FINAL SECRETO",
    title: "MULTIPLAYER UNLOCKED",
    text: "SYSTEM UNLOCK: outro controle foi conectado.",
    className: "ending-secret"
  }
};

const scenes = {
  quarto: {
    label: "QUARTO",
    background: "../static/Imagens/parede.png",
    onEnter: () => {
      showIntroOnce("quartoIntro", [
        "O quarto respira em baixa resolucao.",
        "Tudo parece antigo, mas nada parece terminado."
      ]);
    },
    hotspots: [
      {
        id: "celular",
        x: 75,
        y: 70,
        w: 10,
        h: 12,
        hover: "celular",
        onClick: () => {
          showDialogue([
            "0% de bateria...",
            "Engracado... eu tambem me sinto assim."
          ], { speaker: "DAIKI" });
        }
      },
      {
        id: "janela",
        x: 16,
        y: 7,
        w: 21,
        h: 33,
        hover: "janela",
        onClick: () => {
          state.hasSeenWindow = true;
          gainOnce("janela", "nostalgiaPoints", 1);
          showDialogue([
            "La fora tem uma cidade inteira carregando.",
            "Daqui parece tudo pause screen."
          ], { speaker: "DAIKI" });
        }
      },
      {
        id: "console",
        x: 52,
        y: 52,
        w: 15,
        h: 14,
        hover: "console antigo",
        onClick: () => {
          state.consoleClicks += 1;

          if (state.consoleClicks >= 3 && !state.secretFlags.foundConsole) {
            state.secretFlags.foundConsole = true;
            gainOnce("consoleSecret", "nostalgiaPoints", 2);
            showDialogue([
              "O console fez um som que eu nao ouvia ha anos.",
              "MEMORY CARD DETECTED.",
              "Alguma coisa secreta foi ligada."
            ], { speaker: "SISTEMA" });
            return;
          }

          gainOnce("consoleLook", "nostalgiaPoints", 1);
          showDialogue([
            "Um console antigo.",
            "A poeira sabe mais sobre mim do que eu queria."
          ], { speaker: "DAIKI" });
        }
      },
      {
        id: "porta",
        x: 88,
        y: 35,
        w: 8,
        h: 42,
        hover: "porta",
        onClick: () => {
          setScene("rua");
        }
      }
    ]
  },
  rua: {
    label: "RUA",
    background: "../static/Imagens/cenario1.png",
    onEnter: () => {
      showIntroOnce("ruaIntro", [
        "A rua parece uma fase que alguem esqueceu de terminar.",
        "O vento passa com som de modem."
      ]);
    },
    hotspots: [
      {
        id: "voltar-quarto",
        x: 2,
        y: 43,
        w: 10,
        h: 22,
        hover: "voltar",
        onClick: () => setScene("quarto")
      },
      {
        id: "velho",
        x: 42,
        y: 42,
        w: 12,
        h: 26,
        hover: "velho",
        onClick: talkToOldMan
      },
      {
        id: "placa",
        x: 64,
        y: 22,
        w: 14,
        h: 14,
        hover: "placa",
        onClick: () => {
          showDialogue([
            "A placa pisca: PRACA ->",
            "Parece um convite, ou um bug bonito."
          ], { speaker: "SISTEMA" });
        }
      },
      {
        id: "ir-praca",
        x: 82,
        y: 36,
        w: 12,
        h: 30,
        hover: "ir para a praca",
        onClick: () => setScene("praca")
      }
    ]
  },
  praca: {
    label: "PRACA",
    background: "../static/Imagens/cenario3.png",
    onEnter: () => {
      showIntroOnce("pracaIntro", [
        "A praca tem luz demais para um sonho.",
        "Alguem deixou memorias rodando em segundo plano."
      ]);
    },
    hotspots: [
      {
        id: "voltar-rua",
        x: 2,
        y: 42,
        w: 9,
        h: 22,
        hover: "voltar",
        onClick: () => setScene("rua")
      },
      {
        id: "crianca",
        x: 34,
        y: 48,
        w: 12,
        h: 22,
        hover: "crianca",
        onClick: talkToChild
      },
      {
        id: "banco",
        x: 55,
        y: 62,
        w: 18,
        h: 13,
        hover: "banco vazio",
        onClick: () => {
          gainOnce("benchMemory", "nostalgiaPoints", 1);
          showDialogue([
            "O banco esta vazio.",
            "Mesmo assim, da a impressao de que alguem acabou de levantar."
          ], { speaker: "DAIKI" });
        }
      },
      {
        id: "ir-loja",
        x: 80,
        y: 34,
        w: 14,
        h: 34,
        hover: "loja",
        onClick: () => setScene("loja")
      }
    ]
  },
  loja: {
    label: "LOJA",
    background: "../static/Imagens/fundo4.png",
    onEnter: () => {
      showDialogue([
        "A loja esta quase fechada.",
        "A porta abre como se ja soubesse qual final voce carregou."
      ], {
        speaker: "SISTEMA",
        onComplete: triggerEnding
      });
    },
    hotspots: []
  }
};

const sceneElement = document.getElementById("scene");
const hotspotsElement = document.getElementById("hotspots");
const sceneNameElement = document.getElementById("sceneName");
const nostalgiaScoreElement = document.getElementById("nostalgiaScore");
const connectionScoreElement = document.getElementById("connectionScore");
const dialogBox = document.getElementById("dialogBox");
const dialogName = document.getElementById("dialogName");
const dialogText = document.getElementById("dialogText");
const dialogNext = document.getElementById("dialogNext");
const choiceBox = document.getElementById("choiceBox");
const endingScreen = document.getElementById("endingScreen");
const endingCode = document.getElementById("endingCode");
const endingTitle = document.getElementById("endingTitle");
const endingText = document.getElementById("endingText");
const restartGameButton = document.getElementById("restartGame");

let dialogueQueue = [];
let dialogueIndex = 0;
let dialogueOnComplete = null;

function setScene(sceneName) {
  const scene = scenes[sceneName];

  if (!scene || state.gameEnded) return;

  state.currentScene = sceneName;
  state.visited[sceneName] = true;
  sceneElement.classList.add("is-changing");

  window.setTimeout(() => {
    closeDialogue();
    sceneElement.dataset.scene = sceneName;
    sceneElement.style.backgroundImage = `url("${scene.background}")`;
    sceneNameElement.textContent = scene.label;
    renderHotspots(scene.hotspots);
    updateHud();
    sceneElement.classList.remove("is-changing");

    if (typeof scene.onEnter === "function") {
      scene.onEnter();
    }
  }, 220);
}

function renderHotspots(hotspots) {
  hotspotsElement.innerHTML = "";

  hotspots.forEach((hotspot) => {
    const node = document.createElement("div");

    node.className = "hotspot";
    node.dataset.hotspot = hotspot.id;
    node.dataset.hover = hotspot.hover || hotspot.id;
    node.style.left = `${hotspot.x}%`;
    node.style.top = `${hotspot.y}%`;
    node.style.width = `${hotspot.w}%`;
    node.style.height = `${hotspot.h}%`;
    node.setAttribute("role", "button");
    node.setAttribute("tabindex", "0");
    node.setAttribute("aria-label", hotspot.hover || hotspot.id);

    node.addEventListener("click", hotspot.onClick);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        hotspot.onClick();
      }
    });

    hotspotsElement.appendChild(node);
  });
}

function showDialogue(content, options = {}) {
  dialogueQueue = Array.isArray(content) ? content : [content];
  dialogueIndex = 0;
  dialogueOnComplete = options.onComplete || null;
  choiceBox.innerHTML = "";
  choiceBox.classList.add("hidden");
  dialogName.textContent = options.speaker || "DAIKI";
  dialogBox.classList.remove("hidden");
  dialogNext.classList.remove("hidden");
  renderDialogueLine();
}

function renderDialogueLine() {
  dialogText.textContent = dialogueQueue[dialogueIndex] || "";
  dialogNext.textContent = dialogueIndex < dialogueQueue.length - 1 ? "avancar" : "fechar";
}

function nextDialogue() {
  if (dialogueIndex < dialogueQueue.length - 1) {
    dialogueIndex += 1;
    renderDialogueLine();
    return;
  }

  const callback = dialogueOnComplete;
  closeDialogue();

  if (typeof callback === "function") {
    callback();
  }
}

function closeDialogue() {
  dialogBox.classList.add("hidden");
  choiceBox.innerHTML = "";
  choiceBox.classList.add("hidden");
  dialogNext.classList.remove("hidden");
  dialogueQueue = [];
  dialogueIndex = 0;
  dialogueOnComplete = null;
}

function showChoices(choices) {
  dialogBox.classList.remove("hidden");
  choiceBox.innerHTML = "";
  choiceBox.classList.remove("hidden");
  dialogNext.classList.add("hidden");

  choices.forEach((choice) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      choiceBox.innerHTML = "";
      choiceBox.classList.add("hidden");
      dialogNext.classList.remove("hidden");
      choice.onChoose();
      updateHud();
    });

    choiceBox.appendChild(button);
  });
}

function showIntroOnce(key, lines) {
  if (state.visited[key]) return;

  state.visited[key] = true;
  showDialogue(lines, { speaker: "SISTEMA" });
}

function gainOnce(key, field, amount) {
  if (state.gained[key]) return;

  state[field] += amount;
  state.gained[key] = true;
  updateHud();
}

function ignoreOnce(key) {
  if (state.gained[key]) return;

  state.ignoredNPCs += 1;
  state.gained[key] = true;
}

function talkToOldMan() {
  showDialogue([
    "Todo mundo quer voltar ao passado.",
    "Mas ninguem lembra direito dele."
  ], {
    speaker: "VELHO",
    onComplete: () => {
      showChoices([
        {
          label: "Ficar e ouvir a historia",
          onChoose: () => {
            state.talkedToOldMan = true;
            gainOnce("oldManConnection", "connectionPoints", 1);
            gainOnce("oldManNostalgia", "nostalgiaPoints", 1);
            showDialogue([
              "Ele fala de locadoras, chuva e tardes que pareciam infinitas.",
              "Por um segundo, a rua fica menos vazia."
            ], { speaker: "DAIKI" });
          }
        },
        {
          label: "Passar reto",
          onChoose: () => {
            ignoreOnce("oldManIgnored");
            showDialogue("Eu finjo que nao ouvi. A rua tambem finge.", { speaker: "DAIKI" });
          }
        }
      ]);
    }
  });
}

function talkToChild() {
  showDialogue([
    "Voce tambem esta procurando alguem?",
    "Achei que esse lugar era single player."
  ], {
    speaker: "CRIANCA",
    onComplete: () => {
      showChoices([
        {
          label: "Dividir a memoria do console",
          onChoose: () => {
            state.helpedChild = true;
            state.secretFlags.sharedMoment = true;
            gainOnce("childConnection", "connectionPoints", 2);
            gainOnce("childNostalgia", "nostalgiaPoints", 1);
            showDialogue([
              "Voce descreve o barulho do console ligando.",
              "A crianca sorri como se lembrasse tambem.",
              "SHARED MOMENT gravado."
            ], { speaker: "SISTEMA" });
          }
        },
        {
          label: "Dizer que nao sabe",
          onChoose: () => {
            ignoreOnce("childIgnored");
            showDialogue([
              "Ela olha para o chao.",
              "O silencio ganha mais um ponto."
            ], { speaker: "DAIKI" });
          }
        }
      ]);
    }
  });
}

function calculateEnding() {
  if (
    state.nostalgiaPoints >= 3 &&
    state.connectionPoints >= 3 &&
    state.secretFlags.foundConsole === true &&
    state.secretFlags.sharedMoment === true
  ) {
    return endingData.secret;
  }

  if (
    state.connectionPoints <= 0 &&
    state.talkedToOldMan === false &&
    state.helpedChild === false
  ) {
    return endingData.room;
  }

  if (state.connectionPoints < 3 || state.nostalgiaPoints < 2) {
    return endingData.empty;
  }

  return endingData.memory;
}

function triggerEnding() {
  if (state.gameEnded) return;

  const ending = calculateEnding();
  state.gameEnded = true;
  showEndingScreen(ending);
}

function showEndingScreen(ending) {
  endingScreen.className = `ending-screen ${ending.className}`;
  endingCode.textContent = ending.code;
  endingTitle.textContent = ending.title;
  endingText.textContent = ending.text;
}

function restartGame() {
  state.hasSeenWindow = false;
  state.talkedToOldMan = false;
  state.helpedChild = false;
  state.ignoredNPCs = 0;
  state.nostalgiaPoints = 0;
  state.connectionPoints = 0;
  state.secretFlags.foundConsole = false;
  state.secretFlags.sharedMoment = false;
  state.consoleClicks = 0;
  state.currentScene = "quarto";
  state.gameEnded = false;
  state.visited = {};
  state.gained = {};
  endingScreen.className = "ending-screen hidden";
  setScene("quarto");
}

function updateHud() {
  nostalgiaScoreElement.textContent = `NOSTALGIA ${state.nostalgiaPoints}`;
  connectionScoreElement.textContent = `CONNECTION ${state.connectionPoints}`;
}

dialogNext.addEventListener("click", nextDialogue);
restartGameButton.addEventListener("click", restartGame);

setScene("quarto");
