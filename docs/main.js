(() => {
  const ulElem = document.querySelector("ul");
  const answerDialogElem = document.querySelector("dialog.answer_dialog");
  const answerElem = document.querySelector("dialog.answer_dialog > p.answer");

  let flipper = new Object();

  ulElem.addEventListener("click", () => {
    if (answerDialogElem.open) return;

    const questionElem = ulElem.querySelector("li:hover > p.question");

    if (questionElem === null) return;

    const answerText = flipper[questionElem.innerText];

    if (answerText === undefined) return;

    answerElem.innerText = answerText;

    answerDialogElem.show();
  });

  function hideAnswerDialog() {
    if (answerDialogElem.open) {
      answerDialogElem.close();
    }
  }

  answerDialogElem.addEventListener("click", hideAnswerDialog);

  const type = "application/json";

  {
    const fileLoaderElem = document.getElementById("file_loader");

    fileLoaderElem.addEventListener("change", loadFlashCards, false);
  }

  // The following function depends on type variable,
  //                                   makeFlashCard function,
  //                                   ulElem variable,
  //                               and flipper variable.
  function loadFlashCards() {
    const f = this.files[0];

    if (f.type !== type) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);

      const liFragment = new DocumentFragment();
      json.forEach(({question, answer}) => {
        if (question === undefined) return;
        if (answer === undefined) return;

        liFragment.append(makeFlashCard(question));

        flipper[question] = answer;
      });
      ulElem.append(liFragment);
    };

    reader.readAsText(f);

    const loaderElem = document.querySelector("div.loader");

    loaderElem.style.visibility = "collapse";
  }

  const makerDialogElem = document.querySelector("dialog.maker_dialog");

  function displayFlashCardMaker() {
    if (makerDialogElem.open) return;

    makerDialogElem.show();
  }

  {
    const makerElem = document.getElementById("maker");

    makerElem.addEventListener("click", displayFlashCardMaker);
  }

  function makeFlashCard(question) {
    const pElem = document.createElement("p");
    pElem.innerText = question;
    pElem.className = "question";
    pElem.style.textAlign = "center";

    const liElem = document.createElement("li");
    liElem.append(pElem);

    return liElem;
  }

  {
    const frontSideElem = document.getElementById("question");
    const backSideElem = document.getElementById("answer");

    // The following function depends on frontSideElem variable,
    //                                   backSideElem variable,
    //                                   makeFlashCard function,
    //                                   ulElem variable,
    //                                   flipper variable
    //                               and makerDialogElem variable.
    function addFlashCard() {
      const question = frontSideElem.value;
      const answer = backSideElem.value;
      if (question !== "" && answer !== "") {
        ulElem.append(makeFlashCard(question));

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

  // The following function depends on ulElem variable,
  //                                   answerElem variable,
  //                                   flipper variable
  //                               and answerDialogElem variable.
  function deleteFlashCard() {
    ulElem.childNodes.forEach((liElem) => {
      if (answerElem.innerText === flipper[liElem.innerText]) {
        liElem.remove();
        delete flipper[liElem.innerText];
      }
    })

    answerDialogElem.close();
  }

  {
    const flashCardSlayerElem = document.getElementById("flash_card_slayer");

    flashCardSlayerElem.addEventListener("click", deleteFlashCard);
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

  {
    const exporterElem = document.getElementById("exporter");

    exporterElem.addEventListener("click", exportFlashCards);
  }
})();
