import { flipper } from './environments.js';

class FlashCardShuffler extends HTMLButtonElement {
  constructor() {
    super();

    this.innerText = "Shuffle flash cards";
    this.addEventListener("click", shuffleFlashCards);
  }
}

function shuffleFlashCards() {
  const frontSideContents = Object.keys(flipper);

  shuffle(frontSideContents);

  deck = document.getElementById("deck");
  for (let i = 0; i < frontSideContents.length; ++i) {
    deck.childNodes[i].innerText = frontSideContents[i];
  }
}

// cf. https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
function shuffle(arr) {
  let currentIndex = arr.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
}

export { FlashCardShuffler };
