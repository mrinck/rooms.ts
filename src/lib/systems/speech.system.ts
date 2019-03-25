import { SayAction } from "../actions/say.action";
import { EventManager } from "../../core/eventManager";
import { SayEvent } from "../events/say.event";
import { ComponentManager } from "../../core/componentManager";
import { system } from "../../core/system";
import { NameComponent } from "../components/name.component";
import { LocationComponent } from "../../core/components/location.component";
import { MessageEvent } from "../../core/events/message.event";
import { MoveAction } from "../actions/move.action";

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
            const actorLocationChildren = LocationComponent.getChildren(actorLocation, this.componentManager);

            for (const locationChild of actorLocationChildren) {
                if (locationChild !== event.actor) {
                    this.eventManager.send(new MessageEvent(locationChild, (actorName || "Someone") + " says: " + event.message));
                }
            }
        }
    }
}

