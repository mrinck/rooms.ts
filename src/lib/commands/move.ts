import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Command } from "../../core/api";
import { Room } from "../entities/room";
import { LookCommand } from "./look";

@injectable()
export class MoveCommand implements Command {

    constructor(private lookCommand: LookCommand) { }

    execute(player: Player, direction: string) {
        if (player.location && player.location instanceof Room) {
            const room = player.location as Room;
            const target = room.getExitByDirection(direction);

            if (target) {
                player.location = target;
                this.lookCommand.execute(player);
            } else {
                player.client.write("You can't go in this direction.");
            }
        }

    }
}
