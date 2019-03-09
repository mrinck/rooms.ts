import { MoveAction } from "./move.action";
import { Entity } from "../../../core/api";

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