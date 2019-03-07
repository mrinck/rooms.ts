import { injectable } from "inversify";
import { QuitAction } from "./quit.action";
import { SessionManager } from "../../../core/sessionManager";

@injectable()
export class QuitSystem {

    constructor(private sessionManager: SessionManager) {}

    onQuitAction(action: QuitAction) {
        const session = this.sessionManager.getSessionForPlayer(action.actor);

        if (session) {
            session.destroy();
        }
    }
}