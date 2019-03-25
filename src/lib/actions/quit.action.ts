import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class QuitAction extends Action {
    constructor(
        public actor: Entity
    ) {
        super();
    }
}

export interface OnQuitAction {
    onQuitAction(action: QuitAction): void;
}
