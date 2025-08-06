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

  const p = document.createElement("p");
  p.innerHTML =
    "<strong>🎉 You clicked all correct buttons! Pattern complete!</strong>";

  const againButton = document.createElement("button");
  againButton.textContent = "Puzzle Again?";
  againButton.id = "puzzle-again";

  againButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp());
  });

  console.log(messageArea.innerHTML);

  messageArea.appendChild(p);
  messageArea.appendChild(againButton);
}

function afterUserLost(correctSequence) {
  const messageArea = document.getElementById(CLASSNAMES.result);
  // "❌ Wrong button. You lost."
  const p1 = document.createElement("p");
  p1.innerHTML =
    "<strong>❌ You clicked on the wrong button! Wrong pattern!</strong>";

  const p2 = document.createElement("p");
  p2.innerHTML = `<strong>Correct Pattern:</strong> ${correctSequence.join(
    " --> "
  )}`;

  const tryAgainButton = document.createElement("button");
  tryAgainButton.textContent = "Try Again?";
  tryAgainButton.id = "try-again";

  tryAgainButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp());
  });

  console.log(messageArea.innerHTML);

  messageArea.appendChild(p1);
  messageArea.appendChild(p2);
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
