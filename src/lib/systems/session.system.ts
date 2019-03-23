import { QuitAction } from "../actions/quit.action";
import { SessionManager } from "../../core/sessionManager";
import { EventManager } from "../../core/eventManager";
import { SessionEndEvent } from "../events/sessionEnd.event";
import { system } from "../../core/system";
import { SessionStartEvent } from "../events/sessionStart.event";
import { ComponentManager } from "../../core/componentManager";
import { NameComponent } from "../components/name.component";
import { LocationComponent } from "../../core/components/location.component";
import { MessageEvent } from "../../core/events/message.event";
import { LookEvent } from "../events/look.event";

@system()
export class SessionSystem {

    constructor(
        private eventManager: EventManager,
        private sessionManager: SessionManager,
        private componentManager: ComponentManager
    ) {}

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
            const actorLocationChildren = LocationComponent.getChildren(actorLocation, this.componentManager);

            for (const locationChild of actorLocationChildren) {
                if (locationChild !== event.actor) {
                    this.eventManager.send(new MessageEvent(locationChild, (actorName || "Someone") + " materializes."));
                }
            }
        }

        this.eventManager.send(new LookEvent(event.actor));
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
            const actorLocationChildren = LocationComponent.getChildren(actorLocation, this.componentManager);

            for (const locationChild of actorLocationChildren) {
                if (locationChild !== event.actor) {
                    this.eventManager.send(new MessageEvent(locationChild, (actorName || "Someone") + " disappears."));
                }
            }
        }
    }
}