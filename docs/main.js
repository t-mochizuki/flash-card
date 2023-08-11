(() => {
  const ulElem = document.querySelector("ul");
  const dialogElem = document.querySelector("dialog");
  const answerElem = document.querySelector("dialog > .answer");
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
