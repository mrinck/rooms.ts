import { NetworkConfig } from "./network";
import { ComponentClass } from "./component";
import { WorldData } from "./world";


export interface Application {
    onInit(): void;
}


export interface Config {
    network?: NetworkConfig;
    world: WorldData;
    components: ComponentClass[];
    systems: SystemClass[];
}


export interface Initializable {
    init(config: any): Promise<any>;
}


export interface SystemClass {
    new(...args: any[]): any;
}