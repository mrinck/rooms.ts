import { system } from "../../core/system";
import { UnknownAction } from "../actions/unknown.action";
import { EventManager } from "../../core/eventManager";
import { MessageEvent } from "../../core/events/message.event";
import { HelpAction } from "../actions/help.action";

@system()
export class HelpSystem {

    constructor(
        private eventManager: EventManager
    ) { }

    onHelp(action: HelpAction) {
        const output: string[] = [];
        output.push(
            "\n",
            "Look:     l[ook]\n",
            "Move:     n[orth], e[ast], s[outh], w[est], u[p], d[own]\n",
            "Talk:     say <something>\n",
            "End game: quit\n"
        );
        this.eventManager.send(new MessageEvent(action.actor, output.join("")));
    }

    onUnknown(action: UnknownAction) {
        this.eventManager.send(new MessageEvent(action.actor, "Unknown command \"" + action.input + "\""));
    }

}