import { Observable } from "rxjs";
import { ServerConfig } from "./service/server";
import { WorldConfig } from "./service/world";

export interface Application {
    onInit(): void;
}


export interface ApplicationClass {
    new(...params: any[]): Application;
}


export interface Config {
    server?: ServerConfig;
    world?: WorldConfig;
}


export interface Initializable {
    init(config: any): Observable<any>;
}
