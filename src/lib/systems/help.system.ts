import { system } from "../../core/system";
import { UnknownAction } from "../actions/unknown.action";
import { EventManager } from "../../core/eventManager";
import { Message } from "../../core/message";

@system()
export class HelpSystem {

    constructor(
        private eventManager: EventManager
    ) { }

    onUnknownAction(action: UnknownAction) {
        this.eventManager.send(new Message(action.actor, "Unknown command \"" + action.input + "\""));
    }

}