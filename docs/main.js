(() => {
  const flashCardDeckElem = document.createElement("div");

  class FlashCardDeck extends HTMLElement {
    constructor() {
      super();

      this.append(flashCardDeckElem);
    }
  }

  customElements.define("flash-card-deck", FlashCardDeck);

  const answerDialogElem = document.querySelector("dialog.answer_dialog");
  const answerElem = document.querySelector("dialog.answer_dialog > p.answer");

  let flipper = new Object();

  function displayAnswerDialog() {
    if (answerDialogElem.open) return;

    const questionElem = flashCardDeckElem.querySelector("span:hover > p.question");

    if (questionElem === null) return;

    const answerText = flipper[questionElem.innerText];

    if (answerText === undefined) return;

    answerElem.innerText = answerText;

    answerDialogElem.show();
  }

  flashCardDeckElem.addEventListener("click", displayAnswerDialog);

  function hideAnswerDialog() {
    if (answerDialogElem.open) {
      answerDialogElem.close();
    }
  }

  answerDialogElem.addEventListener("click", hideAnswerDialog);

  const type = "application/json";

  class FlashCardLoader extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({inputType: "file", eventType: "change", label: "Load flash cards", listener: loadFlashCards}))
    }
  }

  customElements.define("flash-card-loader", FlashCardLoader);

  // The following function depends on makeFlashCard function,
  //                               and makeSlayer function.
  function makeFlashCardRole(frontSideContent) {
    const flashCardRoleElem = document.createElement("div");
    flashCardRoleElem.append(makeFlashCard(frontSideContent));
    flashCardRoleElem.append(makeSlayer(frontSideContent));
    flashCardRoleElem.className = "flash_card_roles";

    return flashCardRoleElem;
  }

  // The following function depends on makeFlashCardRole function,
  //                                   flashCardDeckElem variable,
  //                               and flipper variable.
  function addFlashCards(e) {
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

  // The following function depends on type variable,
  //                               and addFlashCards function.
  function loadFlashCards() {
    const f = this.files[0];

    if (f.type !== type) return;

    const reader = new FileReader();

    reader.addEventListener("load", addFlashCards);

    reader.readAsText(f);

    const loaderElem = document.querySelector("flash-card-loader");

    loaderElem.style.visibility = "collapse";
  }

  function makeTextInput({id, label}) {
    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", "text");
    inputElem.setAttribute("id", id);

    const labelElem = document.createElement("label");
    labelElem.innerText = label;
    labelElem.setAttribute("for", id);
    labelElem.append(inputElem);

    const divElem = document.createElement("div");
    divElem.append(labelElem);

    return divElem;
  }

  class MakerDialog extends HTMLElement {
    constructor() {
      super();

      const dialogElem = document.createElement("dialog");
      dialogElem.className = "maker_dialog";
      const frontSideElem = makeTextInput({id: "question", label: "Front side content"});
      dialogElem.append(frontSideElem);
      const backSideElem = makeTextInput({id: "answer", label: "Back side content"});
      dialogElem.append(backSideElem);

      const inputElem = document.createElement("input");
      inputElem.setAttribute("type", "submit");
      inputElem.addEventListener("click", this.addFlashCard);

      const labelElem = document.createElement("label");
      labelElem.innerText = "Make a flash card";
      labelElem.append(inputElem);

      const divElem = document.createElement("div");
      divElem.append(labelElem);

      dialogElem.append(divElem);

      this.append(dialogElem);
    }

    // The following function depends on makeFlashCardRole function,
    //                                   flashCardDeckElem variable,
    //                               and flipper variable.
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

      document.querySelector("dialog.maker_dialog").close();
    }
  }

  customElements.define("maker-dialog", MakerDialog);

  function makeOperator({id, label, inputType, eventType, listener}) {
    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", inputType || "button");
    inputElem.addEventListener(eventType || "click", listener);

    const labelElem = document.createElement("label");
    labelElem.innerText = label;
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
      const makerDialogElem = document.querySelector("dialog.maker_dialog");

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
