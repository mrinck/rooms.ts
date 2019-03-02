import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Command } from "../../core/api";
import { MoveAction } from "../actions/move.action";
import { Dispatcher } from "../../core/dispatcher";

@injectable()
export class MoveCommand implements Command {

    constructor(private dispatcher: Dispatcher) { }

    execute(player: Player, direction: string) {
        const action = new MoveAction(player, direction);
        this.dispatcher.dispatch(action);
    }
}
