import { Entity } from "../../core/api";

export class SayEvent {
    constructor(
        public actor: Entity,
        public message: string
    ) { }
}