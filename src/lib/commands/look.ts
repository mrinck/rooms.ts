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

        if (player.parent) {

            // output description
            if (player.parent.description) {
                output.push(player.parent.description + "\n");
            }

            // output contents
            const locationContents = this.world.getChildren(player.parent);
            if (locationContents.length > 1) {
                for (const content of locationContents) {
                    if (content != player) {
                        output.push(content.name! + " is here. \n");
                    }
                }
            }

            // output exits
            if (player.parent instanceof Room) {
                output.push("Exits: " + player.parent.getExitDirections().join(', ') + "\n");
            }
        } else {
            output.push('Whiteness');
        }

        player.client.write(output.join(''));
    }

}