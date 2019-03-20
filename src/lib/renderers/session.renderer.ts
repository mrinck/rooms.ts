import { injectable } from "inversify";
import { ComponentManager } from "../../core/componentManager";
import { EventManager } from "../../core/eventManager";
import { SessionStartEvent } from "../events/sessionStart.event";
import { NameComponent } from "../components/name.component";
import { LocationComponent } from "../../core/components/location.component";
import { LocationUtil } from "../util/location.util";
import { MessageEvent } from "../../core/events/message.event";
import { LookEvent } from "../events/look.event";
import { SessionEndEvent } from "../events/sessionEnd.event";

injectable()
export class SessionRenderer {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) {}

    onSessionStartEvent(event: SessionStartEvent) {
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
                    this.eventManager.send(new MessageEvent(locationChild, (actorName || "Someone") + " materializes."));
                }
            }
        }

        this.eventManager.send(new LookEvent(event.actor));
    }

    onSessionEndEvent(event: SessionEndEvent) {
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
                    this.eventManager.send(new MessageEvent(locationChild, (actorName || "Someone") + " disappears."));
                }
            }
        }
    }    
}