import { injectable } from "inversify";
import { QuitAction } from "./quit.action";
import { SessionManager } from "../../../core/sessionManager";
import { filter } from "rxjs/operators";
import { Dispatcher } from "../../../core/dispatcher";
import { OnInit } from "../../../core/api";

@injectable()
export class QuitSystem implements OnInit {

    constructor(
        private dispatcher: Dispatcher,
        private sessionManager: SessionManager
    ) {}

    onInit() {
        this.dispatcher.message.pipe(filter(message => message instanceof QuitAction)).subscribe(message => {
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