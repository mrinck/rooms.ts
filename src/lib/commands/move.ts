import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Command } from "../../core/api";
import { MoveAction } from "../actions/move.action";

@injectable()
export class MoveCommand implements Command {

    constructor(
        private moveAction: MoveAction,
    ) { }

    execute(player: Player, direction: string) {
        console.log("executing move command");
        this.moveAction.execute(player, direction);
    }
}
