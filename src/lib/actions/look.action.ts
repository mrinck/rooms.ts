import { Entity } from "../../core/entity";
import { Action } from "../../core/action";

export class LookAction extends Action {

    constructor(
        public subject: Entity
    ) {
        super();
    }
}