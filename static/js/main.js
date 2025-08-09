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

import { CLASSNAMES } from "./constants.js";

// 🌟 Global puzzle state
// Syntax: buttons: turns
const turnsToPatternIncrement = {
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 4,
  10: 4,
  11: 4,
  12: 5,
  13: 5,
  14: 5,
  15: 5,
};
const startingSequenceLength = 1;
const startingButton = 1;
const maxButtons = 16;
const startingChances = 3;

let currentTurns = turnsToPatternIncrement[startingSequenceLength];
let turnCounter = 0;
let streak = 0;
let chances = startingChances;
let currentSequenceLength = startingSequenceLength;
let userSequence = [];
let correctSequence = generatePattern(
  currentSequenceLength,
  startingButton,
  maxButtons
);
let isInputAllowed = false;
let heartDropSound = new Audio("/static/sounds/heart-drop.mp3");
let streakIncreaseSound = new Audio("/static/sounds/streak-up.mp3");
let buttonClickSound = new Audio("/static/sounds/button-click.mp3");

// 🚨 Helpers
function updateStreakDisplay() {
  const displayStreak = document.getElementById(CLASSNAMES.streak);
  streakIncreaseSound.play();
  if (currentSequenceLength < maxButtons) {
    displayStreak.innerText = `🔥 ${streak}`;
  } else {
    displayStreak.innerText = `🧠🔥✨ ${streak}`;
  }
}

function updateChancesDisplay(playSound = false) {
  const full = "❤️".repeat(chances);
  const empty = "🖤".repeat(startingChances - chances);
  if (playSound) {
    heartDropSound.play();
  }
  document.getElementById(CLASSNAMES.hearts).innerText = full + empty;
}

function animateStreak() {
  const displayStreak = document.getElementById(CLASSNAMES.streak);
  displayStreak.classList.add(CLASSNAMES.bounce);
  setTimeout(() => displayStreak.classList.remove(CLASSNAMES.bounce), 500);
}

function animateChances() {
  const displayChances = document.getElementById(CLASSNAMES.hearts);
  displayChances.classList.add(CLASSNAMES.shake);

  setTimeout(() => {
    displayChances.classList.remove(CLASSNAMES.shake);
  }, 500);
}

function fadeAwayStreakAndChances() {
  const displayStreak = document.getElementById(CLASSNAMES.streak);
  const displayChances = document.getElementById(CLASSNAMES.hearts);

  setTimeout(() => {
    displayChances.classList.add(CLASSNAMES.fadeAway);
    displayStreak.classList.add(CLASSNAMES.fadeAway);

    setTimeout(() => {
      displayStreak.innerText = "";
      displayChances.innerText = "";

      displayChances.classList.remove(CLASSNAMES.fadeAway);
      displayStreak.classList.remove(CLASSNAMES.fadeAway);
    }, 500);
  }, 500);
}

function setInputAllowed(allowed) {
  isInputAllowed = allowed;
  const grid = document.getElementById(CLASSNAMES.grid);
  if (allowed) {
    grid.classList.remove("disabled");
  } else {
    grid.classList.add("disabled");
  }
}

// 🌟 Click handler logic
function handleGridClick(num) {
  if (!isInputAllowed) return;
  if (userSequence.includes(num)) return;

  buttonClickSound.play();

  const tempSequence = [...userSequence, num];

  if (isSequenceCorrect(tempSequence, correctSequence)) {
    applyCorrectClickStyle(num);
    userSequence.push(num);

    const isComplete = userSequence.length === correctSequence.length;

    if (isComplete && isSequenceCorrect(userSequence, correctSequence)) {
      setInputAllowed(false);
      afterUserWon(correctSequence);
      streak++;
      if (turnCounter < currentTurns) {
        turnCounter++;
      }
      if (turnCounter === currentTurns) {
        turnCounter = 0;
        if (currentSequenceLength < maxButtons) {
          currentSequenceLength++;
          currentTurns = turnsToPatternIncrement[currentSequenceLength];
        }
      }
      updateStreakDisplay();
      animateStreak();
      updateChancesDisplay();
    }
  } else {
    setInputAllowed(false);
    if (chances > 0 && streak > 0) {
      chances--;
      updateChancesDisplay(true);
      animateChances();
    }
    if (chances === 0) {
      streak = 0;
      turnCounter = 0;
      currentSequenceLength = startingSequenceLength;
      currentTurns = turnsToPatternIncrement[startingSequenceLength];
      fadeAwayStreakAndChances();
    }
    applyWrongClickStyle(num);
    afterUserLost(correctSequence);
  }
}

// 🌟 Start puzzle on initial button click
const button = document.getElementById(CLASSNAMES.startButton);
button.addEventListener("click", () => {
  document.getElementById(CLASSNAMES.beforeStarting).remove();

  const loadingText = document.getElementById(CLASSNAMES.loading);
  loadingText.innerText = "Loading...";

  setTimeout(() => {
    loadingText.innerText = "";

    const grid = document.getElementById(CLASSNAMES.grid);
    grid.style.display = "grid";

    for (let i = 1; i <= 16; i++) {
      const btn = document.getElementById(`btn${i}`);
      btn.addEventListener("click", () => handleGridClick(i));
    }

    previewSequence(
      correctSequence,
      () => {
        setInputAllowed(false);
      },
      () => {
        setInputAllowed(true);
      }
    );
  }, 2000);
});

// 🔄 Restart logic used by utils.js buttons
function restartApp(userLost = false) {
  const messageArea = document.getElementById(CLASSNAMES.result);
  if (messageArea) {
    messageArea.innerHTML = "";
  }

  const grid = document.getElementById(CLASSNAMES.grid);
  grid.style.display = "none";

  const loadingText = document.getElementById(CLASSNAMES.loading);
  loadingText.innerText = "Loading...";

  for (let i = 1; i <= 16; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.classList.remove(CLASSNAMES.win, CLASSNAMES.loss);
  }

  userSequence = [];
  correctSequence = generatePattern(
    currentSequenceLength,
    startingButton,
    maxButtons
  );
  isInputAllowed = false;
  if (userLost && streak === 0) {
    chances = startingChances;
  }

  setTimeout(() => {
    loadingText.innerText = "";
    grid.style.display = "grid";

    previewSequence(
      correctSequence,
      () => {
        setInputAllowed(false);
      },
      () => {
        setInputAllowed(true);
      }
    );
  }, 2000);
}

// 👇 So utils.js can call this safely via dynamic import
export { restartApp };
