import { Entity } from "../../core/api";

export class MoveEndEvent {
    constructor(
        public actor: Entity,
        public location: Entity,
        public startLocation: Entity
    ) { }
}