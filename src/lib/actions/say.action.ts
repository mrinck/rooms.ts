import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class SayAction extends Action {
    constructor(
        public actor: Entity,
        public message: string
    ) {
        super();
    }
}

export interface OnSayAction {
    onSayAction(action: SayAction): void;
}
