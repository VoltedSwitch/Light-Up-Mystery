function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePattern(length = 3, min = 1, max = 16) {
  const pattern = [];
  while (pattern.length < length) {
    const rand = randint(min, max);
    if (!pattern.includes(rand)) {
      pattern.push(rand);
    }
  }
  return pattern;
}

function userisSoFarCorrect(userSequence, correctSequence) {
  return userSequence.every((val, idx) => val === correctSequence[idx]);
}

function userHasWon(userSequence, correctSequence) {
  return (
    userisSoFarCorrect(userSequence, correctSequence) &&
    userSequence.length === correctSequence.length
  );
}

function previewSequence(sequence, onDone) {
  sequence.forEach((num, idx) => {
    setTimeout(() => {
      const btn = document.getElementById(`btn${num}`);
      btn.classList.add("preview-glow");

      setTimeout(() => {
        btn.classList.remove("preview-glow");
      }, 500);
    }, idx * 1000);
  });

  // ✅ Call when done
  setTimeout(() => {
    onDone(); // THIS runs whatever you want afterward
  }, sequence.length * 1000);
}

function applyCorrectClickStyle(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add("clicked-correct");
}

function applyWrongClickStyle(num) {
  const btn = document.getElementById(`btn${num}`);
  btn.classList.add("clicked-wrong");
}

function afterStartButtonClicked(
  correctSequence,
  handleGridClick,
  onPreviewDone
) {
  // 💨 Remove intro
  document.querySelector(".intro").remove();

  // 💬 Show loading...
  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = "Loading...";

  // ⏳ After delay...
  setTimeout(() => {
    loadingText.textContent = "";

    // 📦 Reveal grid
    const grid = document.getElementById("grid-container");
    grid.style.display = "grid";

    // 🖱️ Attach listeners
    for (let i = 1; i <= 16; i++) {
      const btn = document.getElementById(`btn${i}`);
      btn.addEventListener("click", () => handleGridClick(i));
    }

    // ✨ Begin glowing sequence
    previewSequence(correctSequence, onPreviewDone);
  }, 2000);
}

export {
  generatePattern,
  afterStartButtonClicked,
  userisSoFarCorrect,
  applyCorrectClickStyle,
  applyWrongClickStyle,
  userHasWon,
};
