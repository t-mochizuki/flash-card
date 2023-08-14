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

  const makerDialogElem = document.querySelector("dialog.maker_dialog");

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
      if (makerDialogElem.open) return;

      makerDialogElem.show();
    }
  }

  customElements.define("flash-card-maker", FlashCardMaker);

  function makeSlayer(question) {
    const inputElem = document.createElement("input");
    inputElem.setAttribute("type", "submit");
    inputElem.addEventListener("click", () => {
      flashCardDeckElem.childNodes.forEach((flashCardElem) => {
        if (question === flashCardElem.children[0].innerText) {
          delete flipper[flashCardElem.children[0].innerText];
          flashCardElem.remove();
        }
      });
    });

    const labelElem = document.createElement("label");
    labelElem.innerText = "Delete the flash card";
    labelElem.append(inputElem);

    const flashCardSlayerElem = document.createElement("span");
    flashCardSlayerElem.append(labelElem);
    flashCardSlayerElem.className = "flash_card_slayer role";

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

  {
    const frontSideElem = document.getElementById("question");
    const backSideElem = document.getElementById("answer");

    // The following function depends on frontSideElem variable,
    //                                   backSideElem variable,
    //                                   makeFlashCardRole function,
    //                                   flashCardDeckElem variable,
    //                                   flipper variable
    //                               and makerDialogElem variable.
    function addFlashCard() {
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

  {
    const flashCardMakerElem = document.getElementById("flash_card_maker");

    flashCardMakerElem.addEventListener("click", addFlashCard);
  }

  // The following function depends on flipper variable and type variable.
  function exportFlashCards() {
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

  class FlashCardExporter extends HTMLElement {
    constructor() {
      super();

      this.append(makeOperator({label: "Export flash cards", listener: exportFlashCards}));
    }
  }

  customElements.define("flash-card-exporter", FlashCardExporter);
})();
