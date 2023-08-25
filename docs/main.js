import {
  FlashCardDeck,
  FlashCardLoader,
  FlashCardShuffler,
  FlashCardMaker,
  MakerDialog
} from './modules/flashCard.js';
import { FlashCardExporter } from './modules/exporter.js';

customElements.define("flash-card-deck", FlashCardDeck, {extends: "div"});
customElements.define("flash-card-loader", FlashCardLoader, {extends: "button"});
customElements.define("flash-card-shuffler", FlashCardShuffler, {extends: "button"});
customElements.define("maker-dialog", MakerDialog, {extends: "dialog"});
customElements.define("flash-card-maker", FlashCardMaker, {extends: "button"});
customElements.define("flash-card-exporter", FlashCardExporter, {extends: "button"});
