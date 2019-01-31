import "reflect-metadata";
import { Container } from "inversify";
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

function bind(component: any): any {
    container.bind(component).toSelf().inSingletonScope();
    return container.get(component);
}

function init(component: any, config: any): Promise<void> {
    const instance = bind(component) as Initializable;
    const observable = instance.init(config);
    
    return observable.pipe(first()).toPromise();
}
