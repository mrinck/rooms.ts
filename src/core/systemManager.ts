import { injectable } from "inversify";
import { OnInit } from "./api";
import { EventManager } from "./eventManager";
import { filter } from "rxjs/operators";

@injectable()
export class SystemManager implements OnInit {
    eventSystemMap: Map<any, any[]>;

    constructor(
        private eventManager: EventManager
    ) { }

    onInit() {
        this.eventSystemMap = new Map();
    }

    configure(systemConfigs: SystemConfig[]) {
        for (const systemConfig of systemConfigs) {
            this.registerSystem(systemConfig);
        }

        this.subscribeToEvents();
    }

    private registerSystem(systemConfig: SystemConfig) {
        const system = systemConfig.system;
        const events = systemConfig.events;
        for (const event of events) {
            if (!this.eventSystemMap.has(event)) {
                this.eventSystemMap.set(event, []);
            }
            const systems = this.eventSystemMap.get(event);
            systems!.push(system);
        }
    }

    private subscribeToEvents() {
        for (const event of this.eventSystemMap.keys()) {
            this.eventManager.message.pipe(filter(e => e instanceof event)).subscribe(e => this.onEvent(e));
        }
    }

    private onEvent(event: any) {
        const eventName = event.constructor.name;
        for (const mappedEvent of this.eventSystemMap.keys()) {
            if (mappedEvent.name === eventName) {
                const systems = this.eventSystemMap.get(mappedEvent);
                if (systems) {
                    for (const system of systems) {
                        const eventName = event.constructor.name;
                        const listenerName = "on" + eventName.charAt(0).toUpperCase() + eventName.slice(1);
                        if (system[listenerName]) {
                            system[listenerName](event);
                        }
                    }
                }
            }
        }
    }
}

export interface SystemConfig {
    system: any;
    events: any[];
}
