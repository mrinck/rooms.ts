import { Action } from "../../core/action";

export class QuitAction extends Action {

    constructor(
        public actor: string
    ) {
        super();
    }
}