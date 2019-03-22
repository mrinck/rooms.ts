import { ComponentManager } from "../../core/componentManager";
import { EventManager } from "../../core/eventManager";
import { MoveAction } from "../actions/move.action";
import { LocationComponent } from "../../core/components/location.component";
import { ExitsComponent } from "../components/exits.component";
import { LookAction } from "../actions/look.action";
import { MessageEvent } from "../../core/events/message.event";
import { system } from "../../core/system";
import { MoveEvent } from "../events/move.event";
import { SystemManager } from "../../core/systemManager";
import { NameComponent } from "../components/name.component";

@system()
export class MovementSystem {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager,
        private systemManager: SystemManager
    ) { }

    /**
     * To make a move action succeed, following criteria must be met:
     * - the action's actor must have a LocationComponent
     * - the start location must have a ExitsComponent
     * - the start ExitsComponent must include the action's direction
     * - the target location must have a ExitsComponent
     * - the target exitsComponent must include the start location
     */

    onMove(action: MoveAction) {
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
                        
                        const moveEvent = new MoveEvent(actor, startLocation, leaveDirection, targetLocation, enterDirection);
                        this.notifyStartLocationChildren(moveEvent);
                        this.notifyTargetLocationChildren(moveEvent)
                        this.systemManager.execute(new LookAction(actor));
                        return;
                    }
                }
            }
        }

        // Fail
        this.eventManager.send(new MessageEvent(actor, "You can't go in this direction."));
    }

    private notifyStartLocationChildren(event: MoveEvent) {
        let actorName: string;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        } else {
            actorName = "Someone";
        }

        const startLocationChildren = LocationComponent.getChildren(event.startLocation, this.componentManager)

        for (const startLocationChild of startLocationChildren) {
            if (startLocationChild !== event.actor) {
                const message = actorName + " leaves to " + event.leaveDirection;
                this.eventManager.send(new MessageEvent(startLocationChild, message));
            }
        }
    }

    private notifyTargetLocationChildren(event: MoveEvent) {
        let actorName: string;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        } else {
            actorName = "Someone";
        }

        const targetLocationChildren = LocationComponent.getChildren(event.targetLocation, this.componentManager)

        for (const targetLocationChild of targetLocationChildren) {
            if (targetLocationChild !== event.actor) {
                const message = actorName + " enters from " + event.enterDirection;
                this.eventManager.send(new MessageEvent(targetLocationChild, message));
            }
        }
    }
}