import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Room } from "../entities/room";
import { Command } from "../../core/api";
import { World } from "../../core/world";

@injectable()
export class LookCommand implements Command {

    constructor(private world: World) { }

    execute(player: Player) {
        const output: string[] = [];

        const playerLocation = this.world.getEntity(player.locationId);
        if (playerLocation) {

            // output description
            if (playerLocation.description) {
                output.push(playerLocation.description + "\n");
            }

            // output contents
            const locationContents = this.world.getChildren(playerLocation);
            if (locationContents.length > 1) {
                for (const content of locationContents) {
                    if (content != player) {
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

        player.client.write(output.join(''));
    }

}