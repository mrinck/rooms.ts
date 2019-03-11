import { config } from "./config";
import { Entity } from "./api";

export function component() {
    return (componentClass: any) => {
        config.componentClasses.push(componentClass);
    }
}

export abstract class Component {
    type: string;

    abstract entity: Entity;
    abstract value: any;

    constructor() {
        this.type = this.constructor.name;
    }
}

export interface ComponentType<T extends Component> { new(...args: any[]): T }

export interface ComponentClass {
    new(...params: any[]): Component;
}