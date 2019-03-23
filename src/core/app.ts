import "reflect-metadata";
import { config } from "./config";
import { Container, decorate, injectable, interfaces } from "inversify";
import { Logger } from "./logger";
import { Network } from "./network";
import { ComponentManager } from "./componentManager";
import { Clock } from "./clock";
import { EventManager } from "./eventManager";
import { SessionManager } from "./sessionManager";
import { SystemManager } from "./systemManager";
import { CommandManager } from "./commandManager";

const container = new Container();
const services: any[] = [
    Logger,
    EventManager,
    CommandManager,
    Clock,
    ComponentManager,
    SessionManager,
    SystemManager,
    Network
];

export function app() {
    return (appClass: any) => {
        decorate(injectable(), appClass);

        for (const systemClass of config.systems!) {
            services.push(systemClass);
        }

        services.push(appClass);

        for (const service of services) {
            container.bind(service).toSelf().inSingletonScope().onActivation((context: interfaces.Context, instance: any) => {
                if (instance.onInit) {
                    instance.onInit();
                }
                return instance;
            });
        }

        for (const service of services) {
            container.get(service);
        }
    }
}

