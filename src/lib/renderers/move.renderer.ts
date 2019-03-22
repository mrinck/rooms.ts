import { MoveStartEvent } from "../events/moveStart.event";
import { injectable } from "inversify";
import { ComponentManager } from "../../core/componentManager";
import { NameComponent } from "../components/name.component";
import { EventManager } from "../../core/eventManager";
import { MessageEvent } from "../../core/events/message.event";
import { MoveEndEvent } from "../events/moveEnd.event";
import { ExitsComponent } from "../components/exits.component";
import { LocationComponent } from "../../core/components/location.component";

@injectable()
export class MoveRenderer {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) {}

    onMoveStartEvent(event: MoveStartEvent) {
        let actorName: string | undefined;
        
        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }
        
        const locationChildren = LocationComponent.getChildren(event.location, this.componentManager);
        
        for (const child of locationChildren) {
            if (child !== event.actor) {
                this.eventManager.send(new MessageEvent(child, (actorName || "Someone") + " leaves to " + event.direction));
            }
        }
    }

    onMoveEndEvent(event: MoveEndEvent) {
        let actorName: string | undefined;
        let enterDirection: string | undefined;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const locationExitsComponent = this.componentManager.getComponent(event.location, ExitsComponent);

        if (locationExitsComponent) {
            const direction = ExitsComponent.getDirectionForTarget(locationExitsComponent, event.startLocation);
            
            if (direction) {
                enterDirection = direction;
            }
        }
        
        const locationChildren = LocationComponent.getChildren(event.location, this.componentManager);

        for (const child of locationChildren) {
            if (child !== event.actor) {
                this.eventManager.send(new MessageEvent(child, (actorName || "Someone") + " enters from " + (enterDirection || "somewhere")));
            }
        }
    }
}