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

function previewSequence(sequence) {
  sequence.forEach((num, idx) => {
    setTimeout(() => {
      const btn = document.getElementById(`btn${num}`);
      btn.classList.add("preview-glow");

      // Remove glow after 500ms
      setTimeout(() => {
        btn.classList.remove("preview-glow");
      }, 500);
    }, idx * 1000);
  });

  // Let user click only *after* last light-up
  setTimeout(() => {
    isInputAllowed = true;
  }, sequence.length * 1000); // Wait till all are previewed
}

function showClicked(num) {
  btn.document.getElementById(`btn{num}`);
  btn.classList.add("clicked-correct");
}

export {
  generatePattern,
  previewSequence,
  userisSoFarCorrect,
  showClicked,
  userHasWon,
};
