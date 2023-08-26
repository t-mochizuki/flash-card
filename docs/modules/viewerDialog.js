import { flipper } from './environments.js';

class ViewerDialog extends HTMLDialogElement {
  slayer = makeOperator({label: "Delete flash card", listener: this.deleteFlashCard.bind(this)});
  answerElem = document.createElement("p");

  constructor() {
    super();

    this.append(this.answerElem);
    this.answerElem.style.textAlign = "center";

    this.append(this.slayer);

    this.addEventListener("click", this.hide);
  }

  hide() {
    if (this.open) {
      this.close();
    }
  }

  deleteFlashCard() {
    document.getElementById("deck").childNodes.forEach((flashCard) => {
      if (this.answerElem.innerText === flipper[flashCard.innerText]) {
        delete flipper[flashCard.innerText];
        flashCard.remove();
      }
    });
  }
}

function makeOperator({label, listener}) {
  const operator = document.createElement("button");
  operator.innerText = label;
  operator.addEventListener("click", listener);

  return operator;
}

export { ViewerDialog };
