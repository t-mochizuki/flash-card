import { flipper } from './environments.js';

class MakerDialog extends HTMLDialogElement {
  constructor() {
    super();

    this.append(makeInput({id: "question", label: "Front side content"}));
    this.append(makeInput({id: "answer", label: "Back side content"}));
    this.append(makeOperator({label: "Make a flash card", listener: this.addFlashCard}));

    this.addEventListener("click", this.hide);
  }

  hide() {
    if (this.open) {
      this.close();
    }
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
}

function makeInput({id, label}) {
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

function makeOperator({label, listener}) {
  const operator = document.createElement("button");
  operator.innerText = label;
  operator.addEventListener("click", listener);

  return operator;
}

export { MakerDialog };
