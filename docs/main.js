(() => {
  let flipper = new Object();
  const type = "application/json";
  const answerElem = document.createElement("p");
  answerElem.style.textAlign = "center";

  class AnswerDialog extends HTMLDialogElement {
    constructor() {
      super();

      this.append(answerElem);

      this.addEventListener("click", this.hide);
    }

    hide() {
      if (this.open) {
        this.close();
      }
    }

    display() {
      const answerDialog = document.getElementById("answer_dialog");

      if (answerDialog.open) return;

      const questionElem = this.querySelector("span:hover > span.card");

      if (questionElem === null) return;

      const answerText = flipper[questionElem.innerText];

      if (answerText === undefined) return;

      answerElem.innerText = answerText;

      answerDialog.show();
    }
  }

  customElements.define("answer-dialog", AnswerDialog, {extends: "dialog"});

  class FlashCardDeck extends HTMLDivElement {
    constructor() {
      super();

      this.addEventListener("click", document.getElementById("answer_dialog").display);
    }
  }

  customElements.define("flash-card-deck", FlashCardDeck, {extends: "div"});

  class FlashCardLoader extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({label: "Load flash cards", listener: () => {
        const fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");

        const loader = document.getElementById("loader");
        fileInput.addEventListener("change", loader.loadFlashCards);

        document.body.appendChild(fileInput);
        fileInput.click();
        setTimeout(function() {
          document.body.removeChild(fileInput);
        }, 0);
      }}));
    }

    // The following method depends on makeFlashCard function,
    //                             and flipper variable.
    addFlashCards(e) {
      const json = JSON.parse(e.target.result);

      const flashCardFragment = new DocumentFragment();
      json.forEach(({question, answer}) => {
        if (question === undefined) return;
        if (answer === undefined) return;

        if (!flipper.hasOwnProperty(question)) {
          flashCardFragment.append(makeFlashCard(question));
          flipper[question] = answer;
        }
      });
      document.getElementById("deck").append(flashCardFragment);
    }

    // The following method depends on type variable.
    loadFlashCards() {
      const f = this.files[0];

      if (f.type !== type) return;

      const reader = new FileReader();

      reader.addEventListener("load", document.getElementById("loader").addFlashCards);

      reader.readAsText(f);
    }
  }

  customElements.define("flash-card-loader", FlashCardLoader);

  class MakerDialog extends HTMLDialogElement {
    constructor() {
      super();

      this.append(makeOperator({id: "question", inputType: "text", label: "Front side content"}));
      this.append(makeOperator({id: "answer", inputType: "text", label: "Back side content"}));

      const button = document.createElement('button');
      button.innerText = "Make a flash card";
      button.addEventListener("click", this.addFlashCard);
      this.append(button);
    }

    // The following method depends on makeFlashCard function,
    //                             and flipper variable.
    addFlashCard() {
      const frontSideElem = document.getElementById("question");
      const backSideElem = document.getElementById("answer");
      const question = frontSideElem.value;
      const answer = backSideElem.value;
      if (question !== "" && answer !== "") {

        if (!flipper.hasOwnProperty(question)) {
          document.getElementById("deck").append(makeFlashCard(question));
          flipper[question] = answer;
        }

        frontSideElem.value = "";
        backSideElem.value = "";
      }

      document.getElementById("maker_dialog").close();
    }
  }

  customElements.define("maker-dialog", MakerDialog, {extends: "dialog"});

  class FlashCardMaker extends HTMLElement {
    constructor() {
      super();

      const makerDialog = document.getElementById("maker_dialog");

      const button = document.createElement('button');
      button.innerText = "Make a flash card";
      button.addEventListener("click", () => {
        if (makerDialog.open) return;
        makerDialog.show();
      });

      this.append(button);
    }
  }

  customElements.define("flash-card-maker", FlashCardMaker);

  class FlashCardExporter extends HTMLElement {
    constructor() {
      super();

      const button = document.createElement('button');
      button.innerText = "Export flash cards";
      button.addEventListener("click", this.exportFlashCards);
      this.append(button);
    }

    // The following method depends on flipper variable and type variable.
    exportFlashCards() {
      let aElem = document.createElement("a");
      const json = [];
      for (const question in flipper) {
        json.push({question, answer: flipper[question]});
      }
      const f = new Blob([JSON.stringify(json)], {type: type});
      let url = URL.createObjectURL(f);
      aElem.href = url;
      aElem.download = "flashcards";
      document.body.appendChild(aElem);
      aElem.click();
      setTimeout(function() {
        document.body.removeChild(aElem);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  customElements.define("flash-card-exporter", FlashCardExporter);

  function makeOperator({id, label, inputType, eventType, listener}) {
    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", inputType || "button");
    if (listener !== undefined) {
      inputElem.addEventListener(eventType || "click", listener);
    }

    const labelElem = document.createElement("label");
    labelElem.innerText = label;
    if (id !== undefined) {
      inputElem.setAttribute("id", id);
      labelElem.setAttribute("for", id);
    }
    labelElem.append(inputElem);

    const operator = document.createElement("span");
    operator.className = "role";

    operator.append(labelElem);

    return operator;
  }

  function makeFlashCard(question) {
    const cardElem = document.createElement("span");
    cardElem.innerText = question;
    cardElem.className = "card";
    cardElem.style.textAlign = "center";

    const flashCardFlipperElem = document.createElement("span");
    flashCardFlipperElem.append(cardElem);

    return flashCardFlipperElem;
  }
})();
