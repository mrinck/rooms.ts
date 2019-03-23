import { Entity } from "../../core/api";

export class MoveEndEvent {
    constructor(
        public actor: Entity,
        public targetLocation: Entity,
        public enterDirection: string
    ) { }
}