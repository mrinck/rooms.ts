import { injectable } from "inversify";
import { QuitAction } from "../actions/quit.action";
import { SessionManager } from "../../core/sessionManager";
import { filter } from "rxjs/operators";
import { EventManager } from "../../core/eventManager";
import { OnInit } from "../../core/api";
import { SessionEndEvent } from "../events/sessionEnd.event";
import { ComponentManager } from "../../core/componentManager";
import { SessionStartEvent } from "../events/sessionStart.event";
import { LookAction } from "../actions/look.action";
import { LocationComponent } from "../components/location.component";
import { LocationUtil } from "../util/location.util";
import { NameComponent } from "../components/name.component";
import { Message } from "../../core/message";

@injectable()
export class SessionSystem implements OnInit {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager,
        private sessionManager: SessionManager
    ) {}

    onInit() {
        this.eventManager.message.pipe(filter(message => message instanceof QuitAction)).subscribe(message => {
            this.onQuitAction(message);
        });

        this.eventManager.message.pipe(filter(message => message instanceof SessionStartEvent)).subscribe(message => {
            this.onSessionStartEvent(message);
        });

        this.eventManager.message.pipe(filter(message => message instanceof SessionEndEvent)).subscribe(message => {
            this.onSessionEndEvent(message);
        });
    }

    onQuitAction(action: QuitAction) {
        this.eventManager.send(new SessionEndEvent(action.actor));
        
        const session = this.sessionManager.getSessionForPlayer(action.actor);
        
        if (session) {
            session.destroy();
        }
    }

    onSessionStartEvent(event: SessionStartEvent) {
        let actorName: string | undefined;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);
        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const actorLocationComponent = this.componentManager.getComponent(event.actor, LocationComponent);
        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationChildren = LocationUtil.getLocationChildren(actorLocation, this.componentManager);

            for (const locationChild of actorLocationChildren) {
                if (locationChild !== event.actor) {
                    this.eventManager.send(new Message(locationChild, (actorName || "Someone") + " materializes."));
                }
            }
        }

        this.eventManager.send(new LookAction(event.actor));
    }

    onSessionEndEvent(event: SessionEndEvent) {
        let actorName: string | undefined;

        const actorNameComponent = this.componentManager.getComponent(event.actor, NameComponent);
        if (actorNameComponent) {
            actorName = actorNameComponent.value;
        }

        const actorLocationComponent = this.componentManager.getComponent(event.actor, LocationComponent);
        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;
            const actorLocationChildren = LocationUtil.getLocationChildren(actorLocation, this.componentManager);

            for (const locationChild of actorLocationChildren) {
                if (locationChild !== event.actor) {
                    this.eventManager.send(new Message(locationChild, (actorName || "Someone") + " disappears."));
                }
            }
        }
    }
}