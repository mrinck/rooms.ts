import { injectable } from "inversify";
import { QuitAction } from "../actions/quit.action";
import { SessionManager } from "../../core/sessionManager";
import { filter } from "rxjs/operators";
import { EventManager } from "../../core/eventManager";
import { OnInit } from "../../core/api";

@injectable()
export class QuitSystem implements OnInit {

    constructor(
        private eventManager: EventManager,
        private sessionManager: SessionManager
    ) {}

    onInit() {
        this.eventManager.message.pipe(filter(message => message instanceof QuitAction)).subscribe(message => {
            this.onQuitAction(message);
        });
    }

    onQuitAction(action: QuitAction) {
        const session = this.sessionManager.getSessionForPlayer(action.actor);

        if (session) {
            session.destroy();
        }
    }
}