export class Message {
    entityId: string;
    message: string;

    constructor(entityId: string, message: string) {
        this.entityId = entityId;
        this.message = message;
    }
}