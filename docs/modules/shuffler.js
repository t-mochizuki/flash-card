import { flipper } from './environments.js';

class FlashCardShuffler extends HTMLButtonElement {
  #deck = document.getElementById("deck");

  constructor() {
    super();

    this.innerText = "Shuffle flash cards";
    this.addEventListener("click", this.shuffleFlashCards);
  }

  shuffleFlashCards() {
    const arr = Object.keys(flipper);

    this.shuffle(arr);

    for (let i = 0; i < arr.length; ++i) {
      this.#deck.childNodes[i].innerText = arr[i];
    }
  }

  // cf. https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  shuffle(arr) {
    let currentIndex = arr.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);

      currentIndex--;

      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
  }
}

export { FlashCardShuffler };
