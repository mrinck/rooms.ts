import { QuitAction } from "../actions/quit.action";
import { SessionManager } from "../../core/sessionManager";
import { EventManager } from "../../core/eventManager";
import { SessionEndEvent } from "../events/sessionEnd.event";
import { system } from "../../core/system";

@system()
export class SessionSystem {

    constructor(
        private eventManager: EventManager,
        private sessionManager: SessionManager
    ) {}

    onQuit(action: QuitAction) {
        this.eventManager.send(new SessionEndEvent(action.actor));
        
        const session = this.sessionManager.getSessionForPlayer(action.actor);
        
        if (session) {
            session.destroy();
        }
    }
}