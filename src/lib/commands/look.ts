import { injectable } from "inversify";
import { Player } from "../../core/player";
import { Command } from "../../core/api";
import { Dispatcher } from "../../core/dispatcher";
import { LookAction } from "../actions/look.action";

@injectable()
export class LookCommand implements Command {

    constructor(private dispatcher: Dispatcher) { }

    execute(player: Player) {
        const action = new LookAction(player);
        this.dispatcher.dispatch(action);
    }
}