import { ComponentManager } from "../../core/componentManager";
import { EventManager } from "../../core/eventManager";
import { MoveAction } from "../actions/move.action";
import { LocationComponent } from "../../core/components/location.component";
import { ExitsComponent } from "../components/exits.component";
import { LookAction } from "../actions/look.action";
import { MessageEvent } from "../../core/events/message.event";
import { system } from "../../core/system";
import { SystemManager } from "../../core/systemManager";
import { NameComponent } from "../components/name.component";
import { MoveStartEvent } from "../events/moveStart.event";
import { MoveEndEvent } from "../events/moveEnd.event";

@system()
export class MovementSystem {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager,
        private systemManager: SystemManager
    ) { }

    /**
     * To make a move action succeed, following criteria must be met:
     * 1. the action's actor must have a LocationComponent
     * 2. the start location must have a ExitsComponent
     * 3. the start ExitsComponent must include the action's direction
     * 4. the target location must have a ExitsComponent
     * 5. the target exitsComponent must include the start location
     */

    onMoveAction(action: MoveAction) {
        const actor = action.actor;
        const leaveDirection = action.direction;
        const actorLocationComponent = this.componentManager.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const startLocation = actorLocationComponent.value;
            const startLocationExitsComponent = this.componentManager.getComponent(startLocation, ExitsComponent);

            if (startLocationExitsComponent) {
                const targetLocation = ExitsComponent.getTargetForDirection(startLocationExitsComponent, leaveDirection);

                if (targetLocation) {
                    const targetExitsComponent = this.componentManager.getComponent(targetLocation, ExitsComponent);
                    const enterDirection = ExitsComponent.getDirectionForTarget(targetExitsComponent, startLocation);

                    if (enterDirection) {
                        // Success
                        actorLocationComponent.value = targetLocation;
                        
                        this.eventManager.send(new MoveStartEvent(actor, startLocation, leaveDirection));
                        this.eventManager.send(new MoveEndEvent(actor, targetLocation, enterDirection));
                        this.systemManager.execute(new LookAction(actor));
                        return;
                    }
                }
            }
        }

        // Fail
        this.eventManager.send(new MessageEvent(actor, "You can't go in this direction."));
    }

    onMoveStartEvent(event: MoveStartEvent) {
        let actorName = "Someone";
        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const startLocationChildren = LocationComponent.getChildren(event.startLocation, this.componentManager);

        for (const startLocationChild of startLocationChildren) {
            if (startLocationChild !== event.actor) {
                const message = actorName + " leaves to " + event.leaveDirection;
                this.eventManager.send(new MessageEvent(startLocationChild, message));
            }
        }
    }

    onMoveEndEvent(event: MoveEndEvent) {
        let actorName = "Someone";
        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const targetLocationChildren = LocationComponent.getChildren(event.targetLocation, this.componentManager);

        for (const targetLocationChild of targetLocationChildren) {
            if (targetLocationChild !== event.actor) {
                const message = actorName + " enters from " + event.enterDirection;
                this.eventManager.send(new MessageEvent(targetLocationChild, message));
            }
        }
    }
}
