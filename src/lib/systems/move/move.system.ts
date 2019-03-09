import { injectable } from "inversify";
import { ComponentManager } from "../../../core/componentManager";
import { EventManager } from "../../../core/eventManager";
import { MoveAction } from "./move.action";
import { LocationComponent } from "../../components/location.component";
import { ExitsComponent } from "../../components/exits.component";
import { LookAction } from "../look/look.action";
import { Message } from "../../../core/message";
import { filter } from "rxjs/operators";
import { OnInit, Entity } from "../../../core/api";

@injectable()
export class MoveSystem implements OnInit {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) { }

    onInit() {
        this.eventManager.message.pipe(filter(message => message instanceof MoveAction)).subscribe(message => {
            this.onMoveAction(message);
        });
    }

    onMoveAction(action: MoveAction) {
        const actor = action.actor;
        const actorLocationComponent = this.componentManager.getComponent(actor, LocationComponent);
        
        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationExitsComponent = this.componentManager.getComponent(actorLocation, ExitsComponent);

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

    getEntityChildren(entity: Entity): Entity[] {
        const children: string[] = [];
        for (const component of this.componentManager.getComponentsByClass(LocationComponent)) {
            if (component.value === entity) {
                children.push(component.entity);
            }
        }
        return children;
    }


}