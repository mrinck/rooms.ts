import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class MoveAction extends Action {
    constructor(
        public actor: Entity,
        public direction: string
    ) {
        super();
    }
}
