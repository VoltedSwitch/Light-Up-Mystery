// static/js/utils.js

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

function applyCorrectClickStyle(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add("clicked-correct");
}

function applyWrongClickStyle(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add("clicked-wrong");
}

function previewSequence(sequence, previewSpeed, beforeStart, onDone) {
  beforeStart();

  sequence.forEach((num, index) => {
    // This is the "SPACING CLOCK" — tells each button when to START
    const startDelay = index * previewSpeed; // wait before this button flashes

    setTimeout(() => {
      const btn = document.getElementById(`btn${num}`);

      // Turn on the glow
      btn.classList.add("preview-glow");

      // This is the "GLOW CLOCK" — controls how long it stays lit
      const glowDuration = 500; // ms

      setTimeout(() => {
        btn.classList.remove("preview-glow");
      }, glowDuration);
    }, startDelay);
  });

  // This waits until the WHOLE sequence is done, then calls onDone
  const totalTime = sequence.length * previewSpeed;
  setTimeout(() => {
    onDone();
  }, totalTime);
}

// 🎉 Show win message and restart button
function afterUserWon(correctSequence) {
  const resultArea = document.getElementById("result");

  const p = document.createElement("p");
  const buttonsOrButton =
    correctSequence.length === 1
      ? "<strong>🎉 You clicked on the correct button! Pattern complete!</strong>"
      : "<strong>🎉 You clicked on all correct buttons! Pattern complete!</strong>";
  p.innerHTML = buttonsOrButton;

  const againButton = document.createElement("button");
  againButton.textContent = "Puzzle Again?";
  againButton.id = "puzzle-again-button";

  againButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp());
  });

  resultArea.appendChild(p);
  resultArea.appendChild(againButton);
}

// elementsToAdd: array
function afterUserLost(correctSequence, difficultyDiv, streak) {
  const resultArea = document.getElementById("result");
  const p1 = document.createElement("p");
  p1.innerHTML =
    "<strong>❌ You clicked on the wrong button! Wrong pattern!</strong>";

  const p2 = document.createElement("p");
  p2.innerHTML = `<strong>Correct Pattern:</strong> ${correctSequence.join(
    " --> "
  )}`;

  const tryAgainButton = document.createElement("button");
  tryAgainButton.textContent = "Try Again?";
  tryAgainButton.id = "try-again-button";

  tryAgainButton.addEventListener("click", () => {
    import("./main.js").then((mod) => mod.restartApp(true));
  });

  resultArea.appendChild(p1);
  resultArea.appendChild(p2);
  if (streak === 0) {
    const heading = document.getElementById("heading");
    heading.classList.add("decrease-gap");
    tryAgainButton.classList.add("spacing");
    difficultyDiv.classList.remove("hidden");
    resultArea.appendChild(difficultyDiv);
  }
  resultArea.appendChild(tryAgainButton);
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
