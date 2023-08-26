import { flipper } from './environments.js';

class FlashCardDeck extends HTMLDivElement {
  #viewerDialog = document.getElementById("viewer_dialog");

  constructor() {
    super();

    this.addEventListener("click", this.display);
  }

  // display the dialog for viewing the flash card.
  display() {
    if (this.#viewerDialog.open) return;

    const questionElem = this.querySelector(".card:hover");

    if (questionElem === null) return;

    const answerText = flipper[questionElem.innerText];

    if (answerText === undefined) return;

    this.#viewerDialog.answerElem.innerText = answerText;

    this.#viewerDialog.show();
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
  const flashCard = document.createElement("span");
  flashCard.setAttribute("is", "flash-card");
  flashCard.innerText = question;
  flashCard.className = "card";

  return flashCard;
}

export { FlashCardDeck };
