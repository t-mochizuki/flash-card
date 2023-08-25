import { flipper } from './environments.js';
import { type } from './constants.js';

const divElem = document.createElement("div");

class FlashCardDeck extends HTMLDivElement {
  #makerDialog = document.getElementById("maker_dialog");

  constructor() {
    super();

    this.addEventListener("click", this.display);
  }

  display() {
    if (this.#makerDialog.open) return;

    divElem.className = "hidden";
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

class FlashCardLoader extends HTMLButtonElement {
  constructor() {
    super();

    this.innerText = "Load flash cards";
    this.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");

      fileInput.addEventListener("change", this.loadFlashCards);
      fileInput.loader = this;

      document.body.appendChild(fileInput);
      fileInput.click();
      setTimeout(function() {
        document.body.removeChild(fileInput);
      }, 0);
    });
  }

  addFlashCards(e) {
    const arr = JSON.parse(e.target.result);
    document.getElementById("deck").addFlashCards(arr);
  }

  // The following method depends on type variable.
  loadFlashCards(e) {
    const f = this.files[0];

    if (f.type !== type) return;

    const reader = new FileReader();

    reader.addEventListener("load", e.currentTarget.loader.addFlashCards);

    reader.readAsText(f);
  }
}

class MakerDialog extends HTMLDialogElement {
  slayer = this.makeOperator({label: "Delete flash card", listener: this.deleteFlashCard.bind(this)});
  answerElem = document.createElement("p");

  constructor() {
    super();

    this.append(this.answerElem);
    this.answerElem.style.textAlign = "center";

    divElem.append(this.makeInput({id: "question", label: "Front side content"}));
    divElem.append(this.makeInput({id: "answer", label: "Back side content"}));
    divElem.append(this.makeOperator({label: "Make a flash card", listener: this.addFlashCard}));
    this.append(divElem);

    this.append(this.slayer);
    this.slayer.className = "hidden";

    this.addEventListener("click", this.hide);
  }

  hide() {
    if (this.open) {
      this.answerElem.innerText = "";
      divElem.className = "";
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

function makeFlashCard(question) {
  const flashCard = document.createElement("span");
  flashCard.innerText = question;
  flashCard.className = "card";

  return flashCard;
}

export {
  FlashCardDeck,
  FlashCardLoader,
  MakerDialog
};
