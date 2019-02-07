import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { Application, ApplicationClass, Config, Initializable } from "./api";
import { Logger } from "./service/logger";
import { Server } from "./service/server";
import { World } from "./service/world";
import { Clock } from "./service/clock";
import { first } from "rxjs/operators";

const container = new Container();

export async function run(appClass: ApplicationClass, config: Config) {
    await init(Logger, config);
    await init(Clock, config);
    await init(World, config.world || {});
    await init(Server, config.server || {});

    const app = bind(appClass) as Application;
    app.onInit();
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
