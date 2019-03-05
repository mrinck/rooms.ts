import { Action } from "../../../core/action";

export class LookAction extends Action {

    constructor(
        public actor: string
    ) {
        super();
    }
}