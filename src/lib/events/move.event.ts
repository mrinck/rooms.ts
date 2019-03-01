import { Event } from "../../core/event";
import { Entity } from "../../core/entity";

export class MoveEvent extends Event {
    direction: string;
    target: Entity;

    constructor(subject: Entity, direction: string) {
        super();

        this.subject = subject;
        this.direction = direction;
    }
}