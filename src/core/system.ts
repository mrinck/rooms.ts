import { Action } from "./action";
import { ActionClass, SystemClass } from "./api";

export abstract class System {

    // abstract for(actions: ActionClass[]): SystemClass;

    abstract perform(action: Action): void;

}