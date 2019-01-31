import { Observable } from "rxjs";

export interface Application {
    onInit(): void;
}

export interface ApplicationClass {
    new(...params: any[]): Application;
}

export interface Initializable {
    init(config: any): Observable<any>;
}

export interface Config {
    server: ServerConfig;
}

export interface ServerConfig {
    port: number;
}