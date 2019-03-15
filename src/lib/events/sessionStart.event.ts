import { Entity } from "../../core/api";

export class SessionStartEvent {
    constructor(
        public actor: Entity
    ) { }
}