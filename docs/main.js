(() => {
  const ulElem = document.querySelector("ul");
  const answerDialogElem = document.querySelector("dialog.answer_dialog");
  const answerElem = document.querySelector("dialog.answer_dialog > .answer");

  let flipper = new Object();

  ulElem.addEventListener("click", () => {
    if (answerDialogElem.open) return;

    const questionElem = ulElem.querySelector("li:hover > .question");

    if (questionElem === null) return;

    const questionText = flipper[questionElem.innerText];

    if (questionText === undefined) return;

    answerElem.innerText = questionText;

    answerDialogElem.show();
  });

  answerDialogElem.addEventListener("click", () => {
    if (answerDialogElem.open) {
      answerDialogElem.close();
    }
  });

  const fileloaderElem = document.getElementById("fileloader");
  const type = "application/json";

  fileloaderElem.addEventListener("change", handleFile, false);

  function handleFile() {
    const f = this.files[0];

    if (f.type !== type) return;

    const reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        const json = JSON.parse(e.target.result);

        liFragment = new DocumentFragment();
        json.forEach(({question, answer}) => {
          if (question === undefined) return;
          if (answer === undefined) return;

          pElem = document.createElement("p");
          pElem.innerText = question;
          pElem.className = "question";

          liElem = document.createElement("li");
          liElem.append(pElem);

          liFragment.append(liElem);

          flipper[question] = answer;
        });
        ulElem.append(liFragment);
      };
    })(f);

    reader.readAsText(f);

    const loaderElem = document.querySelector(".loader");

    loaderElem.style.visibility = "collapse";
  }

  const exporterElem = document.querySelector(".exporter");

  exporterElem.addEventListener("click", () => {
    let aElem = document.createElement("a");
    const json = [];
    for (const property in flipper) {
      json.push({question: property, answer: flipper[property]});
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
  });
})();
