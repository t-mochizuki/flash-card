(() => {
  const ulElem = document.querySelector("ul");
  const dialogElem = document.querySelector("dialog");
  const answerElem = document.querySelector("dialog > .answer");

  let flipper = new Object();

  ulElem.addEventListener("click", () => {
    if (dialogElem.open) return;

    const questionElem = ulElem.querySelector("li:hover > .question");

    if (questionElem === null) return;

    const questionText = flipper[questionElem.innerText];

    if (questionText === undefined) return;

    answerElem.innerText = questionText;

    dialogElem.show();
  });

  dialogElem.addEventListener("click", () => {
    if (dialogElem.open) {
      dialogElem.close();
    }
  });

  const fileloader = document.getElementById("fileloader");

  fileloader.addEventListener("change", handleFile, false);

  function handleFile() {
    const f = this.files[0];

    if (f.type !== "application/json") return;

    const reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        const json = JSON.parse(e.target.result);

        liFragment = new DocumentFragment();
        json.forEach(({question, answer}) => {
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
  }
})();
