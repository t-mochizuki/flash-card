import { flipper } from './environments.js';

class FlashCard extends HTMLSpanElement {
  #viewerDialog = document.getElementById("viewer_dialog");

  constructor() {
    super();
  }

  // display the dialog for viewing the flash card.
  display() {
    if (this.#viewerDialog.open) return;

    const answerText = flipper[this.innerText];

    if (answerText === undefined) return;

    this.#viewerDialog.answerElem.innerText = answerText;

    this.#viewerDialog.show();
  }
}

export { FlashCard };
