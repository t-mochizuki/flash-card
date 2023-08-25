import { flipper } from './environments.js';

class MakerDialog extends HTMLDialogElement {
  slayer = this.makeOperator({label: "Delete flash card", listener: this.deleteFlashCard.bind(this)});
  answerElem = document.createElement("p");
  form = document.createElement("div");


  constructor() {
    super();

    this.append(this.answerElem);
    this.answerElem.style.textAlign = "center";

    this.form.append(this.makeInput({id: "question", label: "Front side content"}));
    this.form.append(this.makeInput({id: "answer", label: "Back side content"}));
    this.form.append(this.makeOperator({label: "Make a flash card", listener: this.addFlashCard}));
    this.append(this.form);

    this.append(this.slayer);
    this.slayer.className = "hidden";

    this.addEventListener("click", this.hide);
  }

  hide() {
    if (this.open) {
      this.answerElem.innerText = "";
      this.form.className = "";
      this.slayer.className = "hidden";
      this.close();
    }
  }

  makeInput({id, label}) {
    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", "text");
    inputElem.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const labelElem = document.createElement("label");
    labelElem.innerText = label;
    inputElem.setAttribute("id", id);
    labelElem.setAttribute("for", id);
    labelElem.className = "role";

    labelElem.append(inputElem);
    return labelElem;
  }

  makeOperator({label, listener}) {
    const operator = document.createElement("button");
    operator.innerText = label;
    operator.addEventListener("click", listener);

    return operator;
  }

  addFlashCard() {
    const frontSideElem = document.getElementById("question");
    const backSideElem = document.getElementById("answer");
    const question = frontSideElem.value;
    const answer = backSideElem.value;
    if (question !== "" && answer !== "") {
      document.getElementById("deck").addFlashCard(question, answer);

      frontSideElem.value = "";
      backSideElem.value = "";
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

export { MakerDialog };
