import { NetworkConfig } from "./network";
import { Action } from "./action";

export interface ActionClass {
    new(...params: any[]): Action;
}


export interface Application {
    onInit(): void;
}


export interface ApplicationClass {
    new(...params: any[]): Application;
}


export interface Component {
    entityId: string;
    value: any;
}


export interface ComponentClass {
    new(...params: any[]): Component;
}


export interface Config {
    network?: NetworkConfig;
    world?: { data: any };
    components?: ComponentClass[];
    systems?: SystemClass[];
}


export interface Initializable {
    init(config: any): Promise<any>;
}


export interface SystemClass {
    new(...args: any[]): any;
}