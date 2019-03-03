import { injectable } from "inversify";
import { QuitAction } from "../actions/quit.action";

@injectable()
export class QuitHandler {

    onAction(action: QuitAction) {
        action.player.client.disconnect();
    }

}