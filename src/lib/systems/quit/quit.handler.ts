import { injectable } from "inversify";
import { QuitAction } from "./quit.action";
import { World } from "../../../core/world";

@injectable()
export class QuitHandler {

    constructor(private world: World) {}

    onAction(action: QuitAction) {
        this.world.removeEntity(action.player);
        action.player.client.disconnect();
    }

}