import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Room } from "../entities/room";
import { Command } from "../../core/api";

@injectable()
export class LookCommand implements Command {

    constructor() { }

    execute(player: Player) {
        const output: string[] = [];

        if (player.parent) {
            if (player.parent.description) {
                output.push(player.parent.description + "\n");
            }

            if (player.parent instanceof Room) {
                output.push("Exits: " + player.parent.exits.map(exit => exit.direction).join(', '));
            }
        } else {
            output.push('Whiteness');
        }

        player.client.write(output.join(''));
    }

}