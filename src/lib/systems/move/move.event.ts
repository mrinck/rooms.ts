import { MoveAction } from "./move.action";

export class MoveBeginEvent {
    actor: string;
    direction: string;
    originalAction: MoveAction;
}

export class MoveEndEvent {
    actor: string;
    location: string;
    originalAction: MoveAction;
}