import { type } from './constants.js';

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

  loadFlashCards(e) {
    const f = this.files[0];

    if (f.type !== type) return;

    const reader = new FileReader();

    reader.addEventListener("load", e.currentTarget.loader.addFlashCards);

    reader.readAsText(f);
  }
}

export { FlashCardLoader };
