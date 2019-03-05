import { injectable } from "inversify";
import { World } from "../../../core/world";
import { QuitAction } from "./quit.action";

@injectable()
export class QuitHandler {

    constructor(private world: World) {}

    onQuitAction(action: QuitAction) {
    //     const locationId = action.player.locationId;
    //     const location = this.world.getEntity(locationId);

    //     if (location) {
    //         for (const observer of this.world.getChildren(location)) {
    //             if (observer !== action.player) {
    //                 observer.notify(action.player.name + " disappears.");
    //             }
    //         }
    //     }

    //     this.world.removeEntity(action.player);
    //     action.player.client.disconnect();
    }
}