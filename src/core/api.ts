import { NetworkConfig } from "./network";
import { ComponentClass } from "./component";
import { WorldData } from "./componentManager";

export interface DefaultConfig {
    network: NetworkConfig;
    world: WorldData;
    componentClasses: ComponentClass[];
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