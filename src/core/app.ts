import "reflect-metadata";
import { config } from "./config";
import { Container, interfaces, decorate, injectable } from "inversify";
import { Config } from "./api";
import { Logger } from "./logger";
import { Network } from "./network";
import { World } from "./world";
import { Clock } from "./clock";
import { Dispatcher } from "./dispatcher";
import { SessionManager } from "./sessionManager";

const container = new Container();

export function app(userConfig: Config) {

    config.components = userConfig.components || config.components;
    config.network = userConfig.network || config.network;
    config.systems = userConfig.systems || config.systems;
    config.world = userConfig.world || config.world;

    return (target: Function) => {
        decorate(injectable(), target);

        init(Logger);
        init(Dispatcher);
        init(Clock);
        init(World);
        init(SessionManager);
        init(Network);

        for (const systemClass of config.systems!) {
            init(systemClass);
        }

        init(target);
    }
}

function bind<T>(service: interfaces.ServiceIdentifier<T>): any {
    container.bind(service).toSelf().inSingletonScope();
    return container.get(service);
}

function init<T>(service: interfaces.ServiceIdentifier<T>): any {
    const instance = bind(service);
    if (instance.onInit) {
        instance.onInit();
    }
}
