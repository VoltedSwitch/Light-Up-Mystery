import {
  generatePattern,
  userisSoFarCorrect,
  userHasWon,
  previewSequence,
} from "./utils.js";

let userSequence = [];
let correctSequence = generatePattern();
let isInputAllowed = false;

// Preview first!
previewSequence(correctSequence);

function handleClick(num) {
  if (!isInputAllowed) return; // Ignore clicks during preview

  userSequence.push(num);
  if (!userisSoFarCorrect(userSequence, correctSequence)) {
    if (userHasWon(userSequence, correctSequence)) {
        
    }
    // Phase 2: Handle wrong answer here
  }
}
