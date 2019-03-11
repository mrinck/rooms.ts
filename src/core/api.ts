import { NetworkConfig } from "./network";
import { ComponentType, Component } from "./component";

export interface DefaultConfig {
    network: NetworkConfig;
    world: WorldData;
    componentTypes: ComponentType<any>[];
    systems: SystemClass[];
}

export interface Config {
    network?: NetworkConfig;
    world?: WorldData;
    systems?: SystemClass[];
}

export type Entity = string;

export interface SystemClass {
    [key: string]: any;
    new(...args: any[]): any;
}

export interface OnInit {
    onInit(): void;
}

export interface WorldData {
    components: Component[];
}
