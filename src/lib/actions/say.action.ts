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