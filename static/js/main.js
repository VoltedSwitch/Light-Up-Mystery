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
const displayStreak = document.getElementById(CLASSNAMES.streak);
// Syntax: buttons: turns
const turnsToPatternIncrement = {
  3: 2,
  4: 3,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 4,
  10: 5,
  11: 5,
  12: 5,
  13: 6,
  14: 6,
  15: 6,
};
const startingSequenceLength = 3;
const startingButton = 1;
const maxButtons = 16;

let currentTurns = turnsToPatternIncrement[startingSequenceLength];
let turnCounter = 0;
let streak = 0;
let currentSequenceLength = startingSequenceLength;
let userSequence = [];
let correctSequence = generatePattern(
  currentSequenceLength,
  startingButton,
  maxButtons
);
let isInputAllowed = false;

// 🚨 Helpers
function resetState() {
  streak = 0;
  turnCounter = 0;
  currentSequenceLength = startingSequenceLength;
  currentTurns = turnsToPatternIncrement[startingSequenceLength];
  displayStreak.textContent = "";
}

function prepareNextRound() {
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
  if (currentSequenceLength < maxButtons) {
    displayStreak.textContent = `🔥 ${streak}`;
  } else {
    displayStreak.textContent = `🧠🔥✨ ${streak}`;
  }
}
// 🌟 Click handler logic
function handleGridClick(num) {
  if (!isInputAllowed) return;
  if (userSequence.includes(num)) return;

  const tempSequence = [...userSequence, num];

  if (isSequenceCorrect(tempSequence, correctSequence)) {
    applyCorrectClickStyle(num);
    userSequence.push(num);

    const isComplete = userSequence.length === correctSequence.length;

    if (isComplete && isSequenceCorrect(userSequence, correctSequence)) {
      isInputAllowed = false;
      afterUserWon();
      prepareNextRound();
    }
  } else {
    isInputAllowed = false;
    applyWrongClickStyle(num);
    afterUserLost(correctSequence);
    resetState();
  }
}

// 🌟 Start puzzle on initial button click
const button = document.getElementById(CLASSNAMES.startButton);
button.addEventListener("click", () => {
  document.getElementById("intro").remove();

  const loadingText = document.getElementById(CLASSNAMES.loading);
  loadingText.textContent = "Loading...";

  setTimeout(() => {
    loadingText.textContent = "";

    const grid = document.getElementById(CLASSNAMES.grid);
    grid.style.display = "grid";

    for (let i = 1; i <= 16; i++) {
      const btn = document.getElementById(`btn${i}`);
      btn.addEventListener("click", () => handleGridClick(i));
    }

    previewSequence(correctSequence, () => {
      isInputAllowed = true;
    });
  }, 2000);
});

// 🔄 Restart logic used by utils.js buttons
function restartApp() {
  const messageArea = document.getElementById(CLASSNAMES.result);
  if (messageArea) {
    messageArea.innerHTML = "";
  }

  const grid = document.getElementById(CLASSNAMES.grid);
  grid.style.display = "none";

  const loadingText = document.getElementById(CLASSNAMES.loading);
  loadingText.textContent = "Loading...";

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

  setTimeout(() => {
    loadingText.textContent = "";
    grid.style.display = "grid";

    previewSequence(correctSequence, () => {
      isInputAllowed = true;
    });
  }, 2000);
}

// 👇 So utils.js can call this safely via dynamic import
export { restartApp };
