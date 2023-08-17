(() => {
  let flipper = new Object();
  const type = "application/json";
  const flashCardDeckElem = document.createElement("div");
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

  class FlashCardDeck extends HTMLElement {
    constructor() {
      super();

      const answerDialog = document.getElementById("answer_dialog");
      flashCardDeckElem.addEventListener("click", answerDialog.display);

      this.append(flashCardDeckElem);
    }
  }

  customElements.define("flash-card-deck", FlashCardDeck);

  class FlashCardLoader extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({inputType: "file", eventType: "change", label: "Load flash cards", listener: this.loadFlashCards}))
    }

    // The following method depends on makeFlashCard function,
    //                                 flashCardDeckElem variable,
    //                             and flipper variable.
    addFlashCards(e) {
      const json = JSON.parse(e.target.result);

      const flashCardFragment = new DocumentFragment();
      json.forEach(({question, answer}) => {
        if (question === undefined) return;
        if (answer === undefined) return;

        flashCardFragment.append(makeFlashCard(question));

        flipper[question] = answer;
      });
      flashCardDeckElem.append(flashCardFragment);
    }

    // The following method depends on type variable.
    loadFlashCards() {
      const f = this.files[0];

      if (f.type !== type) return;

      const reader = new FileReader();

      const loaderElem = document.querySelector("flash-card-loader")

      reader.addEventListener("load", loaderElem.addFlashCards);

      reader.readAsText(f);

      loaderElem.style.visibility = "collapse";
    }
  }

  customElements.define("flash-card-loader", FlashCardLoader);

  class MakerDialog extends HTMLDialogElement {
    constructor() {
      super();

      this.append(makeOperator({id: "question", inputType: "text", label: "Front side content"}));
      this.append(makeOperator({id: "answer", inputType: "text", label: "Back side content"}));
      this.append(makeOperator({label: "Make a flash card", inputType: "submit", listener: this.addFlashCard}));
    }

    // The following method depends on makeFlashCard function,
    //                                 flashCardDeckElem variable,
    //                             and flipper variable.
    addFlashCard() {
      const frontSideElem = document.getElementById("question");
      const backSideElem = document.getElementById("answer");
      const question = frontSideElem.value;
      const answer = backSideElem.value;
      if (question !== "" && answer !== "") {
        flashCardDeckElem.append(makeFlashCard(question));

        flipper[question] = answer;

        frontSideElem.value = "";
        backSideElem.value = "";
      }

      const makerDialog = document.getElementById("maker_dialog");
      makerDialog.close();
    }
  }

  customElements.define("maker-dialog", MakerDialog, {extends: "dialog"});

  class FlashCardMaker extends HTMLElement {
    constructor() {
      super();

      const makerDialog = document.getElementById("maker_dialog");
      this.append(
        makeOperator({
          label: "Make a flash card",
          listener: () => {
            if (makerDialog.open) return;
            makerDialog.show();
          }
        })
      );
    }
  }

  customElements.define("flash-card-maker", FlashCardMaker);

  class FlashCardExporter extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({label: "Export flash cards", listener: this.exportFlashCards}));
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
