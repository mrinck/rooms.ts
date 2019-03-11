import { Entity } from "../../../core/api";

export class MoveStartEvent {
    constructor(
        public actor: Entity,
        public location: Entity,
        public direction: string
    ) { }
}

export class MoveEndEvent {
    constructor(
        public actor: Entity,
        public location: Entity,
        public startLocation: Entity
    ) { }
}