import { injectable } from "inversify";
import { World } from "../../core/world";
import { Dispatcher } from "../../core/dispatcher";
import { Room } from "../entities/room";
import { MoveAction } from "../actions/move.action";
import { System } from "../../core/system";
import { LookAction } from "../actions/look.action";

@injectable()
export class MovementSystem implements System {

    constructor(
        private world: World,
        private dispatcher: Dispatcher
    ) { }

    perform(action: MoveAction) {
        const location = this.world.getEntity(action.subject.locationId);
        if (location && location instanceof Room) {

            const targetId = location.getExitTargetIdInDirection(action.direction);
            const target = this.world.getEntity(targetId);

            if (target) {
                if (!action.prevented) {
                    action.subject.locationId = targetId;

                    const lookAction = new LookAction(action.subject);
                    this.dispatcher.dispatch(lookAction);
                }
            } else {
                action.subject.notify("You can't go in this direction.");
            }
        }
    }
}