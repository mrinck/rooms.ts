import { Command } from "../../core/api";
import { injectable } from "inversify";
import { Player } from "../../core/player";

@injectable()
export class DefaultCommand implements Command {

    execute(player: Player, input: any) {
        player.notify("Unknown command: " + input);
    }

}