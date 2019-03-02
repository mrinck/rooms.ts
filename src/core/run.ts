import "reflect-metadata";
import { Container, interfaces, decorate, injectable } from "inversify";
import { Application, Config, Initializable } from "./api";
import { Logger } from "./logger";
import { Network } from "./network";
import { World } from "./world";
import { Clock } from "./clock";
import { first } from "rxjs/operators";
import { EntityFactory } from "./entityFactory";
import { Dispatcher } from "./dispatcher";

const container = new Container();

export function run(config: Config) {
    return (target: Function) => {
        decorate(injectable(), target);

        (async () => {
            await init(Logger, config);
            await init(Dispatcher, config);
            await init(Clock, config);
            await init(EntityFactory, config);
            await init(World, config);
            await init(Network, config.network || {});

            for (const systemClass of config.systems) {
                bind(systemClass);
            }

            for (const commandClass of config.commands) {
                bind(commandClass);
            }

            const app = bind(target) as Application;
            app.onInit();
        })();
    }
}

function bind<T>(service: interfaces.ServiceIdentifier<T>): any {
    container.bind(service).toSelf().inSingletonScope();

    return container.get(service);
}

function init<T>(service: interfaces.ServiceIdentifier<T>, config: any): Promise<void> {
    const instance = bind(service) as Initializable;
    const observable = instance.init(config);

    return observable.pipe(first()).toPromise();
}
