import { system } from "../../core/system";
import { UnknownAction, OnUnknownAction } from "../actions/unknown.action";
import { EventManager } from "../../core/eventManager";
import { MessageEvent } from "../../core/events/message.event";
import { HelpAction, OnHelpAction } from "../actions/help.action";

@system()
export class HelpSystem implements OnHelpAction, OnUnknownAction {

    constructor(
        private eventManager: EventManager
    ) { }

    onHelpAction(action: HelpAction) {
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

    onUnknownAction(action: UnknownAction) {
        this.eventManager.send(new MessageEvent(action.actor, "Unknown command \"" + action.input + "\""));
    }

}