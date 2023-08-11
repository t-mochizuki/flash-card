(() => {
  const ulElem = document.querySelector("ul");
  const dialogElem = document.querySelector("dialog");

  ulElem.addEventListener("click", () => {
    if (dialogElem.open) return;

    const liElem = ulElem.querySelector("li:hover");

    if (liElem === null) return;

    dialogElem.show();
  });

  dialogElem.addEventListener("click", () => {
    if (dialogElem.open) {
      dialogElem.close();
    }
  });
})();
