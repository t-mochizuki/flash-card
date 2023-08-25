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

export { FlashCardMaker };
