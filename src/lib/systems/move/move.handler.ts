import { injectable } from "inversify";
import { World } from "../../../core/world";
import { Dispatcher } from "../../../core/dispatcher";
import { Room } from "../../entities/room";
import { LookAction } from "../look/look.action";
import { Entity } from "../../../core/entity";
import { MoveAction } from "./move.action";

@injectable()
export class MoveHandler {

    constructor(
        private world: World,
        private dispatcher: Dispatcher
    ) { }

    onMoveAction(action: MoveAction) {
        const location = this.world.getEntity(action.subject.locationId);

        if (location && location instanceof Room) {
            const targetId = location.getExitTargetIdInDirection(action.direction);
            const target = this.world.getEntity(targetId);

            if (target) {
                for (const child of this.world.getChildren(location)) {
                    this.notifyMoveStart(child, action.subject, action.direction);
                }

                action.subject.locationId = targetId;

                let direction = "somewhere";

                if (target instanceof Room) {
                    direction = target.getExitDirectionOfTargetId(location.id) || "somewhere";
                }

                for (const child of this.world.getChildren(target)) {
                    this.notifyMoveEnd(child, action.subject, direction);
                }

                const lookAction = new LookAction(action.subject);
                this.dispatcher.dispatch(lookAction);
            } else {
                action.subject.notify("You can't go in this direction.");
            }
        }
    }

    private notifyMoveStart(receiver: Entity, actor: Entity, direction: string) {

        if (receiver !== actor) {
            receiver.notify(actor.name + " leaves to " + direction + ".");
        }
    }

    private notifyMoveEnd(receiver: Entity, actor: Entity, direction: string) {

        if (receiver !== actor) {
            receiver.notify(actor.name + " arrives from " + direction + ".");
        }
    }
}