// static/js/main.js

import {
  generatePattern,
  afterUserWon,
  afterUserLost,
  previewSequence,
  applyWrongClickStyle,
  applyCorrectClickStyle,
  isSequenceCorrect,
} from "./utils.js";

// 🌟 Global puzzle state
const startingButton = 1;
const maxButtons = 16;
const startingSequenceLength = 1;
const modes = {
  easy: {
    chances: 6,
    previewSpeed: 1200,
    incrementPatternAt: 4,
  },
  medium: {
    chances: 3,
    previewSpeed: 800,
    incrementPatternAt: 2,
  },
  hard: {
    chances: 1,
    previewSpeed: 500,
    incrementPatternAt: 1,
  },
};
const difficultyDiv = document.getElementById("difficulty-buttons");

let modeName = null;
let chances = null;
let previewSpeed = null;
let incrementPatternAt = null;
let turnCounter = 0;
let streak = 0;
let isGridInputAllowed = false;
let currentSequenceLength = startingSequenceLength;
let userSequence = [];
let correctSequence = generatePattern(
  currentSequenceLength,
  startingButton,
  maxButtons
);
let heartDropSound = new Audio("/static/sounds/heart-drop.mp3");
let streakIncreaseSound = new Audio("/static/sounds/streak-up.mp3");
let buttonClickSound = new Audio("/static/sounds/button-click.mp3");

// 🎵 Add sound for all UI buttons with the press effect
document.querySelectorAll(".button-press-effect").forEach((button) => {
  button.addEventListener("click", () => {
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
  });
});

// 🚨 Helpers
function updateStreakDisplay() {
  const displayStreak = document.getElementById("display-streak");
  streakIncreaseSound.play();
  if (currentSequenceLength < maxButtons) {
    displayStreak.textContent = `🔥 ${streak}`;
  } else {
    displayStreak.textContent = `🧠🔥✨ ${streak}`;
  }
}

function updateChancesDisplay(playSound = false) {
  const full = "❤️".repeat(chances);
  const empty = "🖤".repeat(modes[modeName].chances - chances);
  if (playSound) {
    heartDropSound.play();
  }
  document.getElementById("display-chances").textContent = full + empty;
}

function animateStreak() {
  const displayStreak = document.getElementById("display-streak");
  displayStreak.classList.add("bounce-effect");
  setTimeout(() => displayStreak.classList.remove("bounce-effect"), 500);
}

function animateChances() {
  const displayChances = document.getElementById("display-chances");
  displayChances.classList.add("shake-effect");

  setTimeout(() => {
    displayChances.classList.remove("shake-effect");
  }, 500);
}

function fadeAwayStreakAndChances() {
  const displayStreak = document.getElementById("display-streak");
  const displayChances = document.getElementById("display-chances");

  setTimeout(() => {
    displayChances.classList.add("fade-out");
    displayStreak.classList.add("fade-out");

    setTimeout(() => {
      displayStreak.textContent = "";
      displayChances.textContent = "";

      displayChances.classList.remove("fade-out");
      displayStreak.classList.remove("fade-out");
    }, 500);
  }, 500);
}

function setGridInputAllowed(allowed) {
  isGridInputAllowed = allowed;
  const grid = document.getElementById("grid-container");
  if (allowed) {
    grid.classList.remove("disabled");
  } else {
    grid.classList.add("disabled");
  }
}

function applyMode(modeName) {
  const mode = modes[modeName];
  chances = mode.chances;
  previewSpeed = mode.previewSpeed;
  incrementPatternAt = mode.incrementPatternAt;
}

// 🌟 Click handler logic
function handleGridClick(num) {
  if (!isGridInputAllowed) return;
  if (userSequence.includes(num)) return;

  const tempSequence = [...userSequence, num];

  if (isSequenceCorrect(tempSequence, correctSequence)) {
    applyCorrectClickStyle(num);
    userSequence.push(num);

    const isComplete = userSequence.length === correctSequence.length;

    if (isComplete && isSequenceCorrect(userSequence, correctSequence)) {
      setGridInputAllowed(false);
      afterUserWon(correctSequence);
      streak++;
      if (turnCounter < incrementPatternAt) {
        turnCounter++;
      }
      if (turnCounter === incrementPatternAt) {
        turnCounter = 0;
        if (currentSequenceLength < maxButtons) {
          currentSequenceLength++;
        }
      }
      updateStreakDisplay();
      animateStreak();
      updateChancesDisplay();
    }
  } else {
    setGridInputAllowed(false);
    if (chances > 0 && streak > 0) {
      chances--;
      updateChancesDisplay(true);
      animateChances();
    }
    if (chances === 0) {
      streak = 0;
      turnCounter = 0;
      currentSequenceLength = startingSequenceLength;
      fadeAwayStreakAndChances();
    }
    applyWrongClickStyle(num);
    afterUserLost(correctSequence, difficultyDiv, chances);
  }
}

// 🌟 Start Logic
const difficultyButtons = difficultyDiv.querySelectorAll("button");
const startButton = document.getElementById("start-button");

difficultyButtons.forEach((difficultyBtn) => {
  difficultyBtn.addEventListener("click", () => {
    if (!difficultyBtn.classList.contains("selected")) {
      difficultyButtons.forEach((b) => b.classList.remove("selected"));
      difficultyBtn.classList.add("selected");
      modeName = difficultyBtn.textContent.trim().toLowerCase();
      startButton.classList.remove("disabled");
      const tryAgainButton = document.getElementById("try-again-button");
      if (tryAgainButton) {
        tryAgainButton.classList.remove("disabled");
      }
    } else {
      difficultyBtn.classList.remove("selected");
      modeName = null;
      startButton.classList.add("disabled");
      const tryAgainButton = document.getElementById("try-again-button");
      if (tryAgainButton) {
        tryAgainButton.classList.add("disabled");
      }
    }
  });
});

startButton.addEventListener("click", () => {
  applyMode(modeName);

  const instructions = document.getElementById("instructions");
  instructions.classList.add("hidden");
  startButton.classList.add("hidden");
  difficultyDiv.classList.add("hidden");

  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = "Loading...";

  setTimeout(() => {
    loadingText.textContent = "";

    const grid = document.getElementById("grid-container");
    grid.classList.remove("hidden");

    for (let i = 1; i <= 16; i++) {
      const btn = document.getElementById(`btn${i}`);
      btn.addEventListener("click", () => handleGridClick(i));
    }

    previewSequence(
      correctSequence,
      previewSpeed,
      () => {
        setGridInputAllowed(false);
      },
      () => {
        setGridInputAllowed(true);
      }
    );
  }, 2000);
});

// 🔄 Restart logic used by utils.js buttons
function restartApp(userLost = false) {
  const heading = document.getElementById("heading");
  heading.classList.remove("decrease-gap");
  
  const resultArea = document.getElementById("result");
  if (resultArea) {
    resultArea.innerHTML = "";
  }

  if (userLost && streak === 0) {
    applyMode(modeName);
  }

  const grid = document.getElementById("grid-container");
  grid.classList.add("hidden");

  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = "Loading...";

  for (let i = 1; i <= 16; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.classList.remove("clicked-correct", "clicked-wrong");
  }

  userSequence = [];
  correctSequence = generatePattern(
    currentSequenceLength,
    startingButton,
    maxButtons
  );

  setTimeout(() => {
    loadingText.textContent = "";
    grid.classList.remove("hidden");

    previewSequence(
      correctSequence,
      previewSpeed,
      () => {
        setGridInputAllowed(false);
      },
      () => {
        setGridInputAllowed(true);
      }
    );
  }, 2000);
}

// 👇 So utils.js can call this safely via dynamic import
export { restartApp };
