import { injectable } from "inversify";
import { Initializable, ActionClass } from "./api";
import { of } from "rxjs";
import { Action } from "./action";
import { System } from "./system";

@injectable()
export class Dispatcher implements Initializable {
    actionMap: Map<string, System[]>;

    init() {
        this.actionMap = new Map();

        return of(true);
    }

    register(target: System, actions: ActionClass[]) {
        for(const action of actions) {
            if(!this.actionMap.has(action.name)) {
                this.actionMap.set(action.name, []);
            }
            const targets = this.actionMap.get(action.name);
            targets!.push(target);
        }
    }

    dispatch(action: Action) {
        if (this.actionMap.has(action.constructor.name)) {
            const targets = this.actionMap.get(action.constructor.name);
            for (const target of targets!) {
                target.perform(action);
            }
        } else {
            console.log("No handler for", action.constructor.name, "registered");
        }
    }
}