(() => {
  const flashCardDeckElem = document.createElement("div");
  const makerDialogElem = document.createElement("dialog");
  const answerDialogElem = document.createElement("dialog");
  const answerElem = document.createElement("p");
  answerElem.style.textAlign = "center";

  class AnswerDialog extends HTMLElement {
    constructor() {
      super();

      answerDialogElem.append(answerElem);

      answerDialogElem.addEventListener("click", this.hide);

      this.append(answerDialogElem);
      this.setAttribute("id", "answer_dialog");
    }

    hide() {
      if (answerDialogElem.open) {
        answerDialogElem.close();
      }
    }

    show() {
      if (answerDialogElem.open) return;

      const questionElem = flashCardDeckElem.querySelector("span:hover > p.question");

      if (questionElem === null) return;

      const answerText = flipper[questionElem.innerText];

      if (answerText === undefined) return;

      answerElem.innerText = answerText;

      answerDialogElem.show();
    }
  }

  customElements.define("answer-dialog", AnswerDialog);

  class FlashCardDeck extends HTMLElement {
    constructor() {
      super();

      flashCardDeckElem.addEventListener("click", document.getElementById("answer_dialog").show);

      this.append(flashCardDeckElem);
    }

  }

  customElements.define("flash-card-deck", FlashCardDeck);

  let flipper = new Object();

  const type = "application/json";

  class FlashCardLoader extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({inputType: "file", eventType: "change", label: "Load flash cards", listener: this.loadFlashCards}))
    }

    // The following method depends on makeFlashCardRole function,
    //                                 flashCardDeckElem variable,
    //                             and flipper variable.
    addFlashCards(e) {
      const json = JSON.parse(e.target.result);

      const flashCardFragment = new DocumentFragment();
      json.forEach(({question, answer}) => {
        if (question === undefined) return;
        if (answer === undefined) return;

        flashCardFragment.append(makeFlashCardRole(question));

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

  // The following function depends on makeFlashCard function,
  //                               and makeSlayer function.
  function makeFlashCardRole(frontSideContent) {
    const flashCardRoleElem = document.createElement("div");
    flashCardRoleElem.append(makeFlashCard(frontSideContent));
    flashCardRoleElem.append(makeSlayer(frontSideContent));
    flashCardRoleElem.className = "flash_card_role";

    return flashCardRoleElem;
  }

  class MakerDialog extends HTMLElement {
    constructor() {
      super();

      makerDialogElem.className = "maker_dialog";
      makerDialogElem.append(makeOperator({id: "question", inputType: "text", label: "Front side content"}));
      makerDialogElem.append(makeOperator({id: "answer", inputType: "text", label: "Back side content"}));
      makerDialogElem.append(makeOperator({label: "Make a flash card", inputType: "submit", listener: this.addFlashCard}));

      this.append(makerDialogElem);
    }

    // The following method depends on makeFlashCardRole function,
    //                                 flashCardDeckElem variable,
    //                             and flipper variable.
    addFlashCard() {
      const frontSideElem = document.getElementById("question");
      const backSideElem = document.getElementById("answer");
      const question = frontSideElem.value;
      const answer = backSideElem.value;
      if (question !== "" && answer !== "") {
        flashCardDeckElem.append(makeFlashCardRole(question));

        flipper[question] = answer;

        frontSideElem.value = "";
        backSideElem.value = "";
      }

      makerDialogElem.close();
    }
  }

  customElements.define("maker-dialog", MakerDialog);

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

  class FlashCardMaker extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({label: "Make a flash card", listener: this.show}))
    }

    show() {
      if (makerDialogElem.open) return;

      makerDialogElem.show();
    }
  }

  customElements.define("flash-card-maker", FlashCardMaker);

  function makeSlayer(question) {
    function deleteFlashCard() {
      flashCardDeckElem.childNodes.forEach((flashCardElem) => {
        if (question === flashCardElem.children[0].innerText) {
          delete flipper[flashCardElem.children[0].innerText];
          flashCardElem.remove();
        }
      });
    }

    const flashCardSlayerElem = makeOperator({inputType: "submit", label: "Delete the flash card", listener: deleteFlashCard});
    flashCardSlayerElem.classList += " flash_card_slayer";

    return flashCardSlayerElem;
  }

  function makeFlashCard(question) {
    const pElem = document.createElement("p");
    pElem.innerText = question;
    pElem.className = "question";
    pElem.style.textAlign = "center";

    const flashCardFlipperElem = document.createElement("span");
    flashCardFlipperElem.append(pElem);
    flashCardFlipperElem.className = "flash_card_flipper role";

    return flashCardFlipperElem;
  }

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
})();
