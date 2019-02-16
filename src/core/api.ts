import { Observable } from "rxjs";
import { ServerConfig } from "./server";
import { WorldConfig } from "./world";
import { Player } from "./player";

export interface Application {
    onInit(): void;
}


export interface ApplicationClass {
    new(...params: any[]): Application;
}


export interface Config {
    server?: ServerConfig;
    world?: WorldConfig;
    commands?: CommandClass[];
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
