import { injectable } from "inversify";
import { ComponentManager } from "../../core/componentManager";
import { EventManager } from "../../core/eventManager";
import { MoveAction } from "../actions/move.action";
import { LocationComponent } from "../components/location.component";
import { ExitsComponent } from "../components/exits.component";
import { LookAction } from "../actions/look.action";
import { Message } from "../../core/message";
import { filter } from "rxjs/operators";
import { OnInit } from "../../core/api";
import { MoveStartEvent } from "../events/moveStart.event";
import { NameComponent } from "../components/name.component";
import { LocationUtil } from "../util/locationUtil";
import { ExitsUtil } from "../util/exitsUtil";
import { MoveEndEvent } from "../events/moveEnd.event";

@injectable()
export class MovementSystem implements OnInit {

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
                const target = ExitsUtil.getExitsComponentTargetForDirection(actorLocationExitsComponent, action.direction);

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
        const locationChildren = LocationUtil.getLocationChildren(event.location, this.componentManager);
        console.log("startlocationchildren", locationChildren);
        for (const child of locationChildren) {
            if (child !== event.actor) {
                this.eventManager.send(new Message(child, actorName + " leaves to " + event.direction));
            }
        }
    }

    onMoveEndEvent(event: MoveEndEvent) {
        let actorName: string | undefined;
        let enterDirection: string | undefined;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);

        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const locationExitsComponent = this.componentManager.getComponent(event.location, ExitsComponent);

        if (locationExitsComponent) {
            const direction = ExitsUtil.getExitsComponentDirectionForTarget(locationExitsComponent, event.startLocation);
            
            if (direction) {
                enterDirection = direction;
            }
        }
        
        const locationChildren = LocationUtil.getLocationChildren(event.location, this.componentManager);

        for (const child of locationChildren) {
            if (child !== event.actor) {
                this.eventManager.send(new Message(child, (actorName || "Someone") + " enters from " + (enterDirection || "somewhere")));
            }
        }
    }
}