import { LookAction } from "../actions/look.action";
import { EventManager } from "../../core/eventManager";
import { system } from "../../core/system";
import { LookEvent } from "../events/look.event";

@system()
export class LookSystem {

    constructor(
        private eventManager: EventManager
    ) { }

    onLook(action: LookAction) {
        this.eventManager.send(new LookEvent(action.actor));
    }

}