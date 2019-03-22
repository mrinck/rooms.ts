import { ComponentManager } from "../../core/componentManager";
import { EventManager } from "../../core/eventManager";
import { MoveAction } from "../actions/move.action";
import { LocationComponent } from "../../core/components/location.component";
import { ExitsComponent } from "../components/exits.component";
import { LookAction } from "../actions/look.action";
import { MessageEvent } from "../../core/events/message.event";
import { MoveStartEvent } from "../events/moveStart.event";
import { ExitsUtil } from "../util/exits.util";
import { MoveEndEvent } from "../events/moveEnd.event";
import { system } from "../../core/system";
import { MoveEvent } from "../events/move.event";

@system()
export class MovementSystem {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) { }

    /**
     * To make a move action succeed following criteria must be met:
     * - the actor must have a LocationComponent
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
                const targetLocation = ExitsUtil.getExitsComponentTargetForDirection(startLocationExitsComponent, leaveDirection);

                if (targetLocation) {
                    const targetExitsComponent = this.componentManager.getComponent(targetLocation, ExitsComponent);
                    const enterDirection = ExitsUtil.getExitsComponentDirectionForTarget(targetExitsComponent, startLocation);

                    if (enterDirection) {
                        // Success
                        actorLocationComponent.value = targetLocation;

                        this.eventManager.send(new MoveEvent(actor, startLocation, leaveDirection, targetLocation, enterDirection));
                        this.eventManager.send(new LookAction(actor));
                        return;
                    }
                }
            }
        }

        // Fail
        this.eventManager.send(new MessageEvent(actor, "You can't go in this direction."));
    }
}