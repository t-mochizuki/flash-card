(() => {
  const ulElem = document.querySelector("ul");
  const dialogElem = document.querySelector("dialog");
  const answerElem = document.querySelector("dialog > .answer");

  const json_str = JSON.stringify([{question: "foo", answer: "baz"}, {question: "question", answer: "answer"}]);
  const json = JSON.parse(json_str);

  liFragment = new DocumentFragment();
  json.forEach(({question, answer}) => {
    pElem = document.createElement("p");
    pElem.innerText = question;
    pElem.className = "question";

    liElem = document.createElement("li");
    liElem.append(pElem);

    liFragment.append(liElem);
  });
  ulElem.append(liFragment);

  const flipper = {
    "foo": "baz",
    "question": "answer"
  }

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
})();
