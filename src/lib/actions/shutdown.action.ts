import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class ShutdownAction extends Action {
    constructor(
        public actor: Entity
    ) {
        super();
    }
}

export interface OnShutdownAction {
    onShutdownAction(action: ShutdownAction): void;
}
