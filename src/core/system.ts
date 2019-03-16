import { config } from "./config";
import { decorate, injectable } from "inversify";

export function system() {
    return (systemClass: any) => {
        decorate(injectable(), systemClass);

        config.systems.push(systemClass);
    }
}