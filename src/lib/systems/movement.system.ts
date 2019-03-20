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

@system()
export class MovementSystem {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) { }

    onMove(action: MoveAction) {
        const actor = action.actor;
        const actorLocationComponent = this.componentManager.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationExitsComponent = this.componentManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                const target = ExitsUtil.getExitsComponentTargetForDirection(actorLocationExitsComponent, action.direction);

                if (target) {
                    actorLocationComponent.value = target;
                    this.eventManager.send(new MoveStartEvent(actor, actorLocation, action.direction));
                    this.eventManager.send(new MoveEndEvent(actor, target, actorLocation));
                    this.eventManager.send(new LookAction(actor));
                } else {
                    this.eventManager.send(new MessageEvent(actor, "You can't go in this direction."));
                }
            }
        }
    }
}