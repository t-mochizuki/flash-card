import { flipper } from './environments.js';

class FlashCardSlayer extends HTMLButtonElement {
  constructor() {
    super();

    this.innerText = "Delete the flash card";
  }

  deleteFlashCard() {
    document.getElementById("deck").childNodes.forEach((flashCard) => {
      if (this.parentElement.childNodes[0].innerText === flashCard.childNodes[0].innerText) {
        delete flipper[flashCard.childNodes[0].innerText];
        flashCard.remove();
      }
    });
  }
}

export { FlashCardSlayer };
