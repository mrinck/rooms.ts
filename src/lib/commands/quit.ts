import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Command } from "../../core/api";

@injectable()
export class QuitCommand implements Command {

    execute(player: Player) {
        player.client.disconnect();
    }

}