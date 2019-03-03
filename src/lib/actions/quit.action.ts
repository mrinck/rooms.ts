import { Action } from "../../core/action";
import { Player } from "../../core/player";

export class QuitAction extends Action {

    constructor(
        public player: Player
    ) {
        super();
    }
}