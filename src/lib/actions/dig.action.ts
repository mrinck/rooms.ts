import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class DigAction extends Action {
    constructor(
        public actor: Entity,
        public direction: string
    ) {
        super();
    }
}

export interface OnDigAction {
    onDigAction(action: DigAction): void;
}