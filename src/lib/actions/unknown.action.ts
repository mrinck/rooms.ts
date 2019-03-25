import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class UnknownAction extends Action {
    constructor(
        public actor: Entity,
        public input: string
    ) {
        super();
    }
}

export interface OnUnknownAction {
    onUnknownAction(action: UnknownAction): void;
}