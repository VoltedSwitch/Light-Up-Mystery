// static/js/main.js

import {
  generatePattern,
  afterUserWon,
  afterUserLost,
  previewSequence,
  applyWrongClickStyle,
  applyCorrectClickStyle,
} from "./utils.js";

// 🌟 Global puzzle state
let userSequence = [];
let correctSequence = generatePattern();
let isInputAllowed = false;

// 🌟 Click handler logic
function handleGridClick(num) {
  if (!isInputAllowed) return;
  if (userSequence.includes(num)) return;

  const tempSequence = [...userSequence, num];

  if (tempSequence.every((val, idx) => val === correctSequence[idx])) {
    applyCorrectClickStyle(num);
    userSequence.push(num);

    if (
      userSequence.length === correctSequence.length &&
      tempSequence.every((val, idx) => val === correctSequence[idx])
    ) {
      isInputAllowed = false;
      afterUserWon(); // 🎉
    }
  } else {
    isInputAllowed = false;
    applyWrongClickStyle(num);
    afterUserLost(); // ❌
  }
}

// 🌟 Start puzzle on initial button click
const button = document.getElementById("start-btn");
button.addEventListener("click", () => {
  document.getElementById("intro").remove();

  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = "Loading...";

  setTimeout(() => {
    loadingText.textContent = "";

    const grid = document.getElementById("grid-container");
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
  const messageArea = document.getElementById("result-message");
  if (messageArea) {
    messageArea.innerHTML = "";
  }

  const grid = document.getElementById("grid-container");
  grid.style.display = "none";

  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = "Loading...";

  for (let i = 1; i <= 16; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.classList.remove("clicked-correct", "clicked-wrong");
  }

  userSequence = [];
  correctSequence = generatePattern();
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
