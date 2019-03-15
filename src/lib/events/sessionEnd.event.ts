import { Entity } from "../../core/api";

export class SessionEndEvent {
    constructor(
        public actor: Entity
    ) { }
}