import { Action } from "./action";
import { Event } from "./event";

export interface System {

    onAction(action: Action): void

    onEvent?(event: Event): void
}