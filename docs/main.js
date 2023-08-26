import { MakerDialog } from './modules/makerDialog.js';
import { ViewerDialog } from './modules/viewerDialog.js';
import { FlashCardDeck } from './modules/deck.js';
import { FlashCardLoader } from './modules/loader.js';
import { FlashCardExporter } from './modules/exporter.js';
import { FlashCardShuffler } from './modules/shuffler.js';
import { FlashCardMaker } from './modules/maker.js';

customElements.define("flash-card-deck", FlashCardDeck, {extends: "div"});
customElements.define("flash-card-loader", FlashCardLoader, {extends: "button"});
customElements.define("flash-card-shuffler", FlashCardShuffler, {extends: "button"});
customElements.define("maker-dialog", MakerDialog, {extends: "dialog"});
customElements.define("viewer-dialog", ViewerDialog, {extends: "dialog"});
customElements.define("flash-card-maker", FlashCardMaker, {extends: "button"});
customElements.define("flash-card-exporter", FlashCardExporter, {extends: "button"});
