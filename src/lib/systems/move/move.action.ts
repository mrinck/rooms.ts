import { Action } from "../../../core/action";

export class MoveAction extends Action {

    constructor(
        public actor: string,
        public direction: string
    ) {
        super();
    }
}