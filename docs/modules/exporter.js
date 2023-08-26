import { flipper } from './environments.js';
import { type } from './constants.js';

class FlashCardExporter extends HTMLButtonElement {
  constructor() {
    super();

    this.innerText = "Export flash cards";
    this.addEventListener("click", this.exportFlashCards);
  }

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

export { FlashCardExporter };
