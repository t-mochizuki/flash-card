import { type } from './constants.js';

class FlashCardLoader extends HTMLButtonElement {
  constructor() {
    super();

    this.innerText = "Load flash cards";
    this.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");

      fileInput.addEventListener("change", loadFlashCards);

      document.body.appendChild(fileInput);
      fileInput.click();
      setTimeout(function() {
        document.body.removeChild(fileInput);
      }, 0);
    });
  }
}

function loadFlashCards(e) {
  const f = e.target.files[0];

  if (f.type !== type) return;

  const reader = new FileReader();

  reader.addEventListener("load", addFlashCards);

  reader.readAsText(f);
}

function addFlashCards(e) {
  const arr = JSON.parse(e.target.result);
  document.getElementById("deck").addFlashCards(arr);
}

export { FlashCardLoader };
