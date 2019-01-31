import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { Initializable, ApplicationClass, Application } from "./api";
import { Logger } from "./logger";
import { Server } from "./server";
import { World } from "./world";
import { Clock } from "./clock";
import { first } from "rxjs/operators";

const container = new Container();

export async function run(appClass: ApplicationClass, config: any) {
    await init(Logger, config);
    await init(Clock, config);
    await init(World, config);
    await init(Server, config);

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
