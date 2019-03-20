import { SayAction } from "../actions/say.action";
import { EventManager } from "../../core/eventManager";
import { SayEvent } from "../events/say.event";
import { ComponentManager } from "../../core/componentManager";
import { system } from "../../core/system";

@system()
export class SpeechSystem {

    constructor(
        private eventManager: EventManager
    ) { }

    onSay(action: SayAction) {
        this.eventManager.send(new SayEvent(action.actor, action.message));
    }
}

