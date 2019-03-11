import { Entity } from "../../core/api";

export class MoveStartEvent {
    constructor(
        public actor: Entity,
        public location: Entity,
        public direction: string
    ) { }
}
