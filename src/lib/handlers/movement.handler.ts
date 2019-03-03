import { injectable } from "inversify";
import { World } from "../../core/world";
import { Dispatcher } from "../../core/dispatcher";
import { Room } from "../entities/room";
import { MoveAction } from "../actions/move.action";
import { LookAction } from "../actions/look.action";
import { Entity } from "../../core/entity";

enum MoveOutcome {
    Error,
    Success,
    Prevented,
    NoExitInDirection
}

@injectable()
export class MovementHandler {

    constructor(
        private world: World,
        private dispatcher: Dispatcher
    ) { }

    onAction(action: MoveAction) {
        let outcome = MoveOutcome.Error;
        const location = this.world.getEntity(action.subject.locationId);

        if (location && location instanceof Room) {

            const targetId = location.getExitTargetIdInDirection(action.direction);
            const target = this.world.getEntity(targetId);

            if (target) {
                if (!action.prevented) {
                    action.subject.locationId = targetId;

                    outcome = MoveOutcome.Success;

                    const lookAction = new LookAction(action.subject);
                    this.dispatcher.dispatch(lookAction);
                }
            } else {
                outcome = MoveOutcome.NoExitInDirection;
            }

            for (const observer of this.world.getChildren(location)) {
                this.notifyObserver(observer, action.subject, outcome);
            }
        }

        this.notifySubject(action.subject, outcome);
    }

    private notifySubject(subject: Entity, outcome: MoveOutcome) {
        
        if (outcome === MoveOutcome.NoExitInDirection) {
            subject.notify("You can't go in this direction.");
        }
    }

    private notifyObserver(observer: Entity, subject: Entity, outcome: MoveOutcome) {

        if (outcome === MoveOutcome.Success) {
            observer.notify(subject.name + " moves");
        }
    }
}