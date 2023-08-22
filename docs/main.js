(() => {
  let flipper = new Object();
  const type = "application/json";
  const answerElem = document.createElement("p");
  const divElem = document.createElement("div");
  answerElem.style.textAlign = "center";

  class FlashCardDeck extends HTMLDivElement {
    #makerDialog = document.getElementById("maker_dialog");

    constructor() {
      super();

      this.addEventListener("click", this.display);
    }

    display() {
      if (this.#makerDialog.open) return;

      divElem.className = "hidden";

      const questionElem = this.querySelector("span.card:hover");

      if (questionElem === null) return;

      const answerText = flipper[questionElem.innerText];

      if (answerText === undefined) return;

      answerElem.innerText = answerText;

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

  customElements.define("flash-card-deck", FlashCardDeck, {extends: "div"});

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

  customElements.define("flash-card-loader", FlashCardLoader, {extends: "button"});

  class FlashCardShuffler extends HTMLButtonElement {
    #deck = document.getElementById("deck");

    constructor() {
      super();

      this.innerText = "Shuffle flash cards";
      this.addEventListener("click", this.shuffleFlashCards);
    }

    // The following method depends on shuffle function,
    //                             and flipper variable.
    shuffleFlashCards() {
      const arr = Object.keys(flipper);

      this.shuffle(arr);

      for (let i = 0; i < arr.length; ++i) {
        this.#deck.childNodes[i].childNodes[0].innerText = arr[i];
      }
    }

    // cf. https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    shuffle(arr) {
      let currentIndex = arr.length;

      while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);

        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
      }
    }
  }

  customElements.define("flash-card-shuffler", FlashCardShuffler, {extends: "button"});

  class MakerDialog extends HTMLDialogElement {
    constructor() {
      super();

      this.append(answerElem);
      divElem.append(this.makeInput({id: "question", label: "Front side content"}));
      divElem.append(this.makeInput({id: "answer", label: "Back side content"}));
      divElem.append(this.makeOperator({label: "Make a flash card", listener: this.addFlashCard}));
      this.append(divElem);

      this.addEventListener("click", this.hide);
    }

    hide() {
      if (this.open) {
        answerElem.innerText = "";
        divElem.className = "";
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
  }

  customElements.define("maker-dialog", MakerDialog, {extends: "dialog"});

  class FlashCardMaker extends HTMLButtonElement {
    #makerDialog = document.getElementById("maker_dialog");

    constructor() {
      super();

      this.innerText = "Make a flash card";
      this.addEventListener("click", this.display);
    }

    display() {
      if (this.#makerDialog.open) return;
      this.#makerDialog.show();
    }
  }

  customElements.define("flash-card-maker", FlashCardMaker, {extends: "button"});

  class FlashCardExporter extends HTMLButtonElement {
    constructor() {
      super();

      this.innerText = "Export flash cards";
      this.addEventListener("click", this.exportFlashCards);
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

  customElements.define("flash-card-exporter", FlashCardExporter, {extends: "button"});

  function makeFlashCard(question) {
    const flashCard = document.createElement("span");
    flashCard.innerText = question;
    flashCard.className = "card";

    return flashCard;
  }
})();
