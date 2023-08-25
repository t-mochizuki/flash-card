import { flipper } from './environments.js';

class FlashCardDeck extends HTMLDivElement {
  #makerDialog = document.getElementById("maker_dialog");

  constructor() {
    super();

    this.addEventListener("click", this.display);
  }

  display() {
    if (this.#makerDialog.open) return;

    this.#makerDialog.form.className = "hidden";
    this.#makerDialog.slayer.className = "";

    const questionElem = this.querySelector("span.card:hover");

    if (questionElem === null) return;

    const answerText = flipper[questionElem.innerText];

    if (answerText === undefined) return;

    this.#makerDialog.answerElem.innerText = answerText;

    this.#makerDialog.show();
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

  // The following method depends on makeFlashCard function,
  //                             and flipper variable.
  addFlashCard(question, answer) {
    if (flipper.hasOwnProperty(question)) return;

    this.append(makeFlashCard(question));
    flipper[question] = answer;
  }
}

function makeFlashCard(question) {
  const flashCard = document.createElement("span");
  flashCard.innerText = question;
  flashCard.className = "card";

  return flashCard;
}

export { FlashCardDeck };
