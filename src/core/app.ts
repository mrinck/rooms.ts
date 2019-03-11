import "reflect-metadata";
import { config } from "./config";
import { Container, decorate, injectable } from "inversify";
import { Config } from "./api";
import { Logger } from "./logger";
import { Network } from "./network";
import { ComponentManager } from "./componentManager";
import { Clock } from "./clock";
import { EventManager } from "./eventManager";
import { SessionManager } from "./sessionManager";

const container = new Container();
const services: any[] = [
    Logger,
    EventManager,
    Clock,
    ComponentManager,
    SessionManager,
    Network
];

export function app(userConfig: Config) {
    config.components = userConfig.components || config.components;
    config.network = userConfig.network || config.network;
    config.systems = userConfig.systems || config.systems;
    config.world = userConfig.world || config.world;

    return (appClass: any) => {
        decorate(injectable(), appClass);

        for (const systemClass of config.systems!) {
            services.push(systemClass);
        }

        services.push(appClass);

        for (const service of services) {
            container.bind(service).toSelf().inSingletonScope();
        }

        for (const service of services) {
            const instance = container.get<any>(service);
            if (instance.onInit) {
                instance.onInit();
            }
        }
    }
}
