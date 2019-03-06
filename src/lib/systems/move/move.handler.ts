import { injectable } from "inversify";
import { World } from "../../../core/world";
import { Dispatcher } from "../../../core/dispatcher";
import { MoveAction } from "./move.action";
import { LocationComponent } from "../../components/location.component";
import { ExitsComponent } from "../../components/exits.component";
import { LookAction } from "../look/look.action";
import { Message } from "../../../core/message";

@injectable()
export class MoveHandler {

    constructor(
        private world: World,
        private dispatcher: Dispatcher
    ) { }

    onMoveAction(action: MoveAction) {
        const actor = action.actor;

        const actorLocationComponent = this.world.getComponent(actor, LocationComponent);
        
        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationExitsComponent = this.world.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                const target = actorLocationExitsComponent.getExitTargetIdInDirection(action.direction);

                if (target) {
                    actorLocationComponent.value = target;

                    const lookAction = new LookAction(actor);
                    this.dispatcher.dispatch(lookAction);
                } else {
                    this.dispatcher.dispatch(new Message(actor, "You can't go in this direction."));
                }
            }
        }
    }
}