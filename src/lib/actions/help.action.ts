import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class HelpAction extends Action {
    constructor(
        public actor: Entity
    ) {
        super();
    }
}

export interface OnHelpAction {
    onHelpAction(action: HelpAction): void;
}