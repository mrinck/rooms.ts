import { injectable } from "inversify";
import { World } from "../../../core/world";
import { Room } from "../../entities/room";
import { LookAction } from "./look.action";

@injectable()
export class LookHandler {

    constructor(
        private world: World
    ) { }

    onLookAction(action: LookAction) {
        const output: string[] = [];

        const playerLocation = this.world.getEntity(action.subject.locationId);
        if (playerLocation) {

            // output description
            if (playerLocation.description) {
                output.push(playerLocation.description + "\n");
            }

            // output contents
            const locationContents = this.world.getChildren(playerLocation);
            if (locationContents.length > 1) {
                for (const content of locationContents) {
                    if (content != action.subject) {
                        output.push(content.name! + " is here. \n");
                    }
                }
            }

            // output exits
            if (playerLocation instanceof Room) {
                output.push("Exits: " + playerLocation.getExitDirections().join(', ') + "\n");
            }
        } else {
            output.push('Whiteness');
        }

        action.subject.notify(output.join(''));
    }

}