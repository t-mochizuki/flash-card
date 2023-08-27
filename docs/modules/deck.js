import { flipper } from './environments.js';
import { FlashCard } from './card.js';
import { FlashCardSlayer } from './slayer.js';

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
    const slayer = this.querySelector(".slayer:hover");
    if (slayer !== null) {
      slayer.deleteFlashCard();
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
  const divElem = document.createElement("div");
  const flashCard = new FlashCard();
  flashCard.innerText = question;
  flashCard.className = "card";
  const slayer = new FlashCardSlayer();
  slayer.className = "slayer";
  divElem.append(flashCard);
  divElem.append(slayer);

  return divElem;
}

export { FlashCardDeck };
