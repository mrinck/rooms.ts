import { Observable } from "rxjs";
import { NetworkConfig } from "./network";
import { WorldConfig } from "./world";
import { Player } from "./player";
import { EntityClass } from "./entity";

export interface Application {
    onInit(): void;
}


export interface ApplicationClass {
    new(...params: any[]): Application;
}


export interface Config {
    network?: NetworkConfig;
    world?: WorldConfig;
    commands: CommandClass[];
    entities: EntityClass[];
}


export interface Initializable {
    init(config: any): Observable<any>;
}

export interface Command {
    execute(player: Player, args?: any): void;
}

export interface CommandClass {
    new(...args: any[]): Command;
}
