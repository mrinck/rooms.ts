import { Intent } from "../../core/intent";
import { Entity } from "../../core/entity";

export class MoveIntent extends Intent {
    direction: string;

    constructor(subject: Entity, direction: string) {
        super();
        
        this.subject = subject;
        this.direction = direction;
    }
}