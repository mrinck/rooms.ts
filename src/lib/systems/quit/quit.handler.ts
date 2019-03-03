import { injectable } from "inversify";
import { QuitAction } from "./quit.action";

@injectable()
export class QuitHandler {

    onAction(action: QuitAction) {
        action.player.client.disconnect();
    }

}