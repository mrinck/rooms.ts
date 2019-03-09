import { injectable } from "inversify";
import { EntityManager } from "../../../core/entityManager";
import { EventManager } from "../../../core/eventManager";
import { MoveAction } from "./move.action";
import { LocationComponent } from "../../components/location.component";
import { ExitsComponent } from "../../components/exits.component";
import { LookAction } from "../look/look.action";
import { Message } from "../../../core/message";
import { filter } from "rxjs/operators";
import { OnInit } from "../../../core/api";

@injectable()
export class MoveSystem implements OnInit {

    constructor(
        private entityManager: EntityManager,
        private eventManager: EventManager
    ) { }

    onInit() {
        this.eventManager.message.pipe(filter(message => message instanceof MoveAction)).subscribe(message => {
            this.onMoveAction(message);
        });
    }

    onMoveAction(action: MoveAction) {
        const actor = action.actor;
        const actorLocationComponent = this.entityManager.getComponent(actor, LocationComponent);
        
        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationExitsComponent = this.entityManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                const target = actorLocationExitsComponent.getExitTargetIdInDirection(action.direction);

                if (target) {
                    actorLocationComponent.value = target;
                    const lookAction = new LookAction(actor);
                    this.eventManager.send(lookAction);
                } else {
                    this.eventManager.send(new Message(actor, "You can't go in this direction."));
                }
            }
        }
    }
}