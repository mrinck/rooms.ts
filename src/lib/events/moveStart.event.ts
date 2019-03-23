import { Entity } from "../../core/api";

export class MoveStartEvent {
    constructor(
        public actor: Entity,
        public startLocation: Entity,
        public leaveDirection: string
    ) { }
}