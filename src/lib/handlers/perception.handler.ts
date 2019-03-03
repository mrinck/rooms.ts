import { injectable } from "inversify";
import { System } from "../../core/system";
import { World } from "../../core/world";
import { LookAction } from "../actions/look.action";
import { Room } from "../entities/room";

@injectable()
export class PerceptionHandler implements System {

    constructor(
        private world: World
    ) { }

    onAction(action: LookAction) {
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