// static/js/utils.js

import { CLASSNAMES } from "./constants.js";

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePattern(length = 5, min = 1, max = 16) {
  const pattern = [];
  while (pattern.length < length) {
    const rand = randint(min, max);
    if (!pattern.includes(rand)) {
      pattern.push(rand);
    }
  }
  return pattern;
}

function applyCorrectClickStyle(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add(CLASSNAMES.win);
}

function applyWrongClickStyle(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add(CLASSNAMES.loss);
}

function previewSequence(sequence, onDone) {
  sequence.forEach((num, idx) => {
    setTimeout(() => {
      const btn = document.getElementById(`btn${num}`);
      btn.classList.add(CLASSNAMES.glow);

      setTimeout(() => {
        btn.classList.remove(CLASSNAMES.glow);
      }, 500);
    }, idx * 1000);
  });

  setTimeout(() => {
    onDone();
  }, sequence.length * 1000);
}

// 🎉 Show win message and restart button
function afterUserWon() {
  const messageArea = document.getElementById(CLASSNAMES.result);

  const strong = document.createElement("strong");
  strong.textContent = "🎉 You won!";
  strong.style.display = "block";

  const br = document.createElement("br");

  const againButton = document.createElement("button");
  againButton.textContent = "Puzzle Again?";
  againButton.id = "puzzle-again";

  againButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp());
  });

  console.log(messageArea.innerHTML);

  messageArea.appendChild(strong);
  messageArea.appendChild(br);
  messageArea.appendChild(againButton);
}

// ❌ Show loss message and restart button
function afterUserLost() {
  const messageArea = document.getElementById(CLASSNAMES.result);

  const strong = document.createElement("strong");
  strong.textContent = "❌ Wrong button. You lost.";
  strong.style.display = "block";

  const br = document.createElement("br");

  const tryAgainButton = document.createElement("button");
  tryAgainButton.textContent = "Try Again?";
  tryAgainButton.id = "try-again";

  tryAgainButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp());
  });

  console.log(messageArea.innerHTML);

  messageArea.appendChild(strong);
  messageArea.appendChild(br);
  messageArea.appendChild(tryAgainButton);
}

function isSequenceCorrect(partial, correct) {
  return partial.every((val, idx) => val === correct[idx]);
}

export {
  generatePattern,
  applyCorrectClickStyle,
  applyWrongClickStyle,
  previewSequence,
  afterUserWon,
  afterUserLost,
  isSequenceCorrect,
};
