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
const startingLength = 3;
const maxTurns = 2;

let turnCounter = 0;
let streak = 0;

let length = startingLength;
let min = 1;
let max = 16;

let userSequence = [];
let correctSequence = generatePattern(length, min, max);
let isInputAllowed = false;

// 🌟 Click handler logic
function handleGridClick(num) {
  if (!isInputAllowed) return;
  if (userSequence.includes(num)) return;

  const tempSequence = [...userSequence, num];
  const displayStreak = document.getElementById(CLASSNAMES.streak);

  if (isSequenceCorrect(tempSequence, correctSequence)) {
    applyCorrectClickStyle(num);
    userSequence.push(num);

    const isComplete = userSequence.length === correctSequence.length;

    if (isComplete && isSequenceCorrect(tempSequence, correctSequence)) {
      isInputAllowed = false;
      afterUserWon();
      streak++;
      if (turnCounter < maxTurns) {
        turnCounter++;
      }
      if (turnCounter === maxTurns) {
        turnCounter = 0;
        length++;
      }
      displayStreak.textContent = `🔥 ${streak}`;
    }
  } else {
    isInputAllowed = false;
    applyWrongClickStyle(num);
    afterUserLost(correctSequence);
    streak = 0;
    turnCounter = 0;
    length = startingLength;
    displayStreak.textContent = "";
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
  correctSequence = generatePattern(length, min, max);
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
