import { Observable } from "rxjs";
import { NetworkConfig } from "./network";
import { WorldConfig } from "./world";
import { Player } from "./player";
import { EntityClass } from "./entity";
import { Action } from "./action";
import { System } from "./system";

export interface ActionClass {
    new(...params: any[]): Action;
}


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
    systems: SystemClass[];
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

export interface SystemClass {
    new(...args: any[]): System;
}