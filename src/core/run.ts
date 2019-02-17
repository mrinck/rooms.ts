import "reflect-metadata";
import { Container, interfaces, decorate, injectable } from "inversify";
import { Application, Config, Initializable } from "./api";
import { Logger } from "./logger";
import { Server } from "./server";
import { World } from "./world";
import { Clock } from "./clock";
import { first } from "rxjs/operators";

const container = new Container();

export function run(config: Config) {
    return (target: Function) => {
        decorate(injectable(), target);

        (async () => {
            await init(Logger, config);
            await init(Clock, config);
            await init(World, config);
            await init(Server, config.server || {});

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
