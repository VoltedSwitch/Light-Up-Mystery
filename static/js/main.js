import {
  generatePattern,
  afterStartButtonClicked,
  userisSoFarCorrect,
  applyCorrectClickStyle,
  applyWrongClickStyle,
  userHasWon,
} from "./utils.js";

// 🌟 Global game state
let userSequence = [];
let correctSequence = generatePattern();
let isInputAllowed = false;

// 🌟 This is the function we'll pass to utils.js
function handleGridClick(num) {
  if (!isInputAllowed) return;

  if (userSequence.includes(num)) return;

  const tempSequence = [...userSequence, num]; // 📌 simulate next step

  if (userisSoFarCorrect(tempSequence, correctSequence)) {
    applyCorrectClickStyle(num);
    userSequence.push(num); // 🧠 now it's safe to update!

    if (userHasWon(userSequence, correctSequence)) {
      console.log("🎉 You won!");
    }
  } else {
    applyWrongClickStyle(num);
    console.log("❌ Wrong button. You lost.");
  }
}

// 🌟 Start button logic
const button = document.getElementById("start-btn");
button.addEventListener("click", () => {
  afterStartButtonClicked(correctSequence, handleGridClick, () => {
    isInputAllowed = true;
  });
});
