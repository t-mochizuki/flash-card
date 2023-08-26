import { flipper } from './environments.js';
import { FlashCard } from './card.js';

class FlashCardDeck extends HTMLDivElement {
  constructor() {
    super();
    this.addEventListener("click", this.display);
  }

  display() {
    const flashCard = this.querySelector(".card:hover");
    if (flashCard !== null) {
      flashCard.display();
      return;
    }
  }

  addFlashCards(arr) {
    const flashCardFragment = new DocumentFragment();
    arr.forEach(({question, answer}) => {
      if (question === undefined) return;
      if (answer === undefined) return;

      if (!flipper.hasOwnProperty(question)) {
        flashCardFragment.append(makeFlashCard(question));
        flipper[question] = answer;
      }
    });
    this.append(flashCardFragment);
  }

  addFlashCard(question, answer) {
    if (flipper.hasOwnProperty(question)) return;

    this.append(makeFlashCard(question));
    flipper[question] = answer;
  }
}

function makeFlashCard(question) {
  const flashCard = new FlashCard();
  flashCard.innerText = question;
  flashCard.className = "card";

  return flashCard;
}

export { FlashCardDeck };
