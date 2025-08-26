// static/js/utils.js

import { CLASSNAMES } from "./constants.js";

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePattern(length, min, max) {
  const pattern = [];
  while (pattern.length < length) {
    const rand = randint(min, max);
    if (!pattern.includes(rand)) {
      pattern.push(rand);
    }
  }
  return pattern;
}

function applyCorrectClick(num, sequence) {
  // Add green to correctly clicked button
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add(CLASSNAMES.win);

  // Create numbers from 1 to last item number mapped to each correct button ordered number in the sequence
  const mapped = {};
  let counter = 1;
  for (let number of sequence) {
    mapped[number] = counter;
    counter++;
  }

  // Number the correctly clicked button in the order of all correct clicked buttons
  btn.innerText = mapped[num];
}

function applyWrongClick(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add(CLASSNAMES.loss);
}

function previewSequence(sequence, beforeStart, onDone) {
  beforeStart();
  sequence.forEach((num, idx) => {
    setTimeout(() => {
      const btn = document.getElementById(`btn${num}`);
      btn.classList.add(CLASSNAMES.glow);

      setTimeout(() => {
        btn.classList.remove(CLASSNAMES.glow);
      }, 500);
    }, idx * 500);
  });

  setTimeout(() => {
    onDone();
  }, sequence.length * 500);
}

// 🎉 Show win message and restart button
function afterUserWon(correctSequence) {
  const messageArea = document.getElementById(CLASSNAMES.result);

  const p = document.createElement("p");
  const buttonsOrButton =
    correctSequence.length === 1
      ? "<strong>🎉 You clicked on the correct button! Pattern complete!</strong>"
      : "<strong>🎉 You clicked on all correct buttons! Pattern complete!</strong>";
  p.innerHTML = buttonsOrButton;

  const againButton = document.createElement("button");
  againButton.innerText = "Puzzle Again?";
  againButton.id = "puzzle-again";

  againButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp());
  });

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
  tryAgainButton.innerText = "Try Again?";
  tryAgainButton.id = "try-again";

  tryAgainButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp(true));
  });

  messageArea.appendChild(p1);
  messageArea.appendChild(p2);
  messageArea.appendChild(tryAgainButton);
}

function isSequenceCorrect(partial, correct) {
  return partial.every((val, idx) => val === correct[idx]);
}

export {
  generatePattern,
  applyCorrectClick,
  applyWrongClick,
  previewSequence,
  afterUserWon,
  afterUserLost,
  isSequenceCorrect,
};
