import { flipper } from './environments.js';

class ViewerDialog extends HTMLDialogElement {
  answerElem = document.createElement("p");

  constructor() {
    super();

    this.append(this.answerElem);
    this.answerElem.style.textAlign = "center";
    this.addEventListener("click", this.hide);
  }

  hide() {
    if (this.open) {
      this.close();
    }
  }
}

export { ViewerDialog };
