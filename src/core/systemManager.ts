import { injectable } from "inversify";
import { OnInit } from "./api";
import { Action, ActionClass } from "./action";

@injectable()
export class SystemManager implements OnInit {
    actionHandlerMap: Map<ActionClass, any[]>;

    onInit() {
        this.actionHandlerMap = new Map();
    }

    configure(actionConfigs: ActionConfig[]) {
        for (const actionConfig of actionConfigs) {
            this.registerAction(actionConfig);
        }
    }

    execute(action: Action) {
        for (const actionClass of this.actionHandlerMap.keys()) {
            if (action instanceof actionClass) {
                const systems = this.actionHandlerMap.get(actionClass);
                if (systems) {
                    for (const system of systems) {
                        const actionName = action.constructor.name.replace(/Action$/, "");
                        const listenerName = "on" + actionName.charAt(0).toUpperCase() + actionName.slice(1);
                        console.log("listener Name", listenerName);
                        if (system[listenerName]) {
                            system[listenerName](action);
                        }
                    }
                }
            }
        }
    }

    private registerAction(actionConfig: ActionConfig) {
        this.actionHandlerMap.set(actionConfig.action, actionConfig.handlers);
    }
}

export interface ActionConfig {
    action: ActionClass;
    handlers: any[];
}
