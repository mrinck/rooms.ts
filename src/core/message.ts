import { Entity } from "./api";

export class Message {
    entityId: Entity;
    message: string;

    constructor(entityId: Entity, message: string) {
        this.entityId = entityId;
        this.message = message;
    }
}