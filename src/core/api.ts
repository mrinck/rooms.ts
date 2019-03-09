import { NetworkConfig } from "./network";
import { ComponentClass } from "./component";
import { WorldData } from "./world";

export interface Config {
    network?: NetworkConfig;
    world?: WorldData;
    components?: ComponentClass[];
    systems?: SystemClass[];
}

export type Entity = string;

export interface SystemClass {
    new(...args: any[]): any;
}

export interface OnInit {
    onInit(): void;
}