import { Entity } from "../../../core/entity";
import { Action } from "../../../core/action";

export class MoveAction extends Action {

    constructor(
        public subject: Entity,
        public direction: string
    ) {
        super();
    }
}