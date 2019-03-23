import { injectable } from "inversify";
import { OnInit } from "./api";
import { Action, ActionClass } from "./action";
import { EventManager } from "./eventManager";

@injectable()
export class SystemManager implements OnInit {
    systems: any[];
    actionHandlerMap: Map<ActionClass, any[]>;

    constructor(private eventManager: EventManager) { }

    onInit() {
        this.systems = [];
        this.actionHandlerMap = new Map();
        this.eventManager.message.subscribe(event => this.handle(event));
    }

    configure(systemsConfig: SystemsConfig) {
        this.systems = systemsConfig.systems;

        const actionConfigs = systemsConfig.actionHandlers;
        for (const actionConfig of actionConfigs) {
            this.registerAction(actionConfig);
        }
    }

    execute(action: Action) {
        const actionName = action.constructor.name;
        const listenerName = "on" + actionName.charAt(0).toUpperCase() + actionName.slice(1);

        for (const actionClass of this.actionHandlerMap.keys()) {
            if (action instanceof actionClass) {
                const systems = this.actionHandlerMap.get(actionClass);
                if (systems) {
                    for (const system of systems) {
                        if (!action.prevented) {
                            if (system[listenerName]) {
                                system[listenerName](action);
                            }
                        }
                    }
                }
            }
        }
    }

    private registerAction(actionConfig: ActionConfig) {
        this.actionHandlerMap.set(actionConfig.action, actionConfig.handlers);
    }

    handle(event: any) {
        const eventName = event.constructor.name;
        const listenerName = "on" + eventName.charAt(0).toUpperCase() + eventName.slice(1);

        console.log("handling", eventName, "via", listenerName);

        for (const system of this.systems) {
            if (system[listenerName]) {
                system[listenerName](event);
            }
        }
    }
}

export interface SystemsConfig {
    systems: any[];
    actionHandlers: ActionConfig[];
}


export interface ActionConfig {
    action: ActionClass;
    handlers: any[];
}
