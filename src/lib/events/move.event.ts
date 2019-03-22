import { Entity } from "../../core/api";

export class MoveEvent {
    constructor(
        public actor: Entity,
        public startLocation: Entity,
        public leaveDirection: string,
        public targetLocation: Entity,
        public enterDirection: string
    ) { }
}