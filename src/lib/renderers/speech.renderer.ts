import { injectable } from "inversify";
import { ComponentManager } from "../../core/componentManager";
import { EventManager } from "../../core/eventManager";
import { SayEvent } from "../events/say.event";
import { NameComponent } from "../components/name.component";
import { LocationComponent } from "../../core/components/location.component";
import { MessageEvent } from "../../core/events/message.event";

@injectable()
export class SpeechRenderer {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) {}

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