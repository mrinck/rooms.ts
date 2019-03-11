import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class LookAction extends Action {

    constructor(
        public actor: Entity
    ) {
        super();
    }
}