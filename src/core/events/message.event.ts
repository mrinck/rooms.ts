import { Entity } from "../api";

export class MessageEvent {
    constructor(
        public entity: Entity,
        public message: string
    ) { }
}