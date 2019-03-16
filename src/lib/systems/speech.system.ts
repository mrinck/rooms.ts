import { SayAction } from "../actions/say.action";
import { EventManager } from "../../core/eventManager";
import { SayEvent } from "../events/say.event";
import { ComponentManager } from "../../core/componentManager";
import { NameComponent } from "../components/name.component";
import { LocationComponent } from "../components/location.component";
import { LocationUtil } from "../util/location.util";
import { Message } from "../../core/message";
import { system } from "../../core/system";

@system()
export class SpeechSystem {

    constructor(
        private eventManager: EventManager,
        private componentManager: ComponentManager
    ) { }

    onSayAction(action: SayAction) {
        this.eventManager.send(new SayEvent(action.actor, action.message));
    }

    onSayEvent(event: SayEvent) {
        let actorName: string | undefined;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);
        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const actorLocationComponent = this.componentManager.getComponent(event.actor, LocationComponent);
        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationChildren = LocationUtil.getLocationChildren(actorLocation, this.componentManager);

            for (const locationChild of actorLocationChildren) {
                if (locationChild !== event.actor) {
                    this.eventManager.send(new Message(locationChild, (actorName || "Someone") + " says: " + event.message));
                }
            }
        }
    }
}