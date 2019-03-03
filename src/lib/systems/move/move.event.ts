import { Entity } from "../../../core/entity";
import { MoveAction } from "./move.action";

export class MoveBeginEvent {
    actor: Entity;
    direction: string;
    originalAction: MoveAction;
}

export class MoveEndEvent {
    actor: Entity;
    location: Entity;
    originalAction: MoveAction;
}