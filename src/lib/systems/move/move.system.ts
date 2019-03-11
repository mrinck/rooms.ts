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
import { MoveStartEvent, MoveEndEvent } from "./move.event";
import { NameComponent } from "../../components/name.component";
import { LocationUtil } from "../../util/locationUtil";

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

        this.eventManager.message.pipe(filter(message => message instanceof MoveStartEvent)).subscribe(message => {
            this.onMoveStartEvent(message);
        });

        this.eventManager.message.pipe(filter(message => message instanceof MoveEndEvent)).subscribe(message => {
            this.onMoveEndEvent(message);
        });
    }

    onMoveAction(action: MoveAction) {
        const actor = action.actor;
        const actorLocationComponent = this.componentManager.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationExitsComponent = this.componentManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                const target = actorLocationExitsComponent.getTargetForDirection(action.direction);

                if (target) {
                    actorLocationComponent.value = target;
                    this.eventManager.send(new MoveStartEvent(actor, actorLocation, action.direction));
                    this.eventManager.send(new MoveEndEvent(actor, target, actorLocation));
                    this.eventManager.send(new LookAction(actor));
                } else {
                    this.eventManager.send(new Message(actor, "You can't go in this direction."));
                }
            }
        }
    }

    onMoveStartEvent(event: MoveStartEvent) {
        console.log("Move Start", event);
        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);
        let actorName = "Someone";
        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }
        const startLocationChildren = LocationUtil.getLocationChildren(event.location, this.componentManager);
        console.log("startlocationchildren", startLocationChildren);
        for (const child of startLocationChildren) {
            if (child !== event.actor) {
                this.eventManager.send(new Message(child, actorName + " leaves to " + event.direction));
            }
        }
    }

    onMoveEndEvent(event: MoveEndEvent) {
        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);
        let actorName = "Someone";
        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }
        const locationComponent = this.componentManager.getComponent(event.location, LocationComponent);
        if (locationComponent) {
            const startLocationChildren = LocationUtil.getLocationChildren(locationComponent.value, this.componentManager);
            for (const child of startLocationChildren) {
                if (child !== event.actor) {
                    this.eventManager.send(new Message(child, actorName + " enters from " + event.startLocation));
                }
            }
        }
    }
}