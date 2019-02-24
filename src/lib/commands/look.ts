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

        if (player.location) {

            // output description
            if (player.location.description) {
                output.push(player.location.description + "\n");
            }

            // output contents
            const locationContents = this.world.getChildren(player.location);
            if (locationContents.length > 1) {
                for (const content of locationContents) {
                    if (content != player) {
                        output.push(content.name! + " is here. \n");
                    }
                }
            }

            // output exits
            if (player.location instanceof Room) {
                output.push("Exits: " + player.location.getExitDirections().join(', ') + "\n");
            }
        } else {
            output.push('Whiteness');
        }

        player.client.write(output.join(''));
    }

}