import { Entity } from "./entity";

export abstract class Intent {
    subject: Entity;
    promise: Promise<any>;
    
    private _prevented: boolean;
    private _preventionCause: string | undefined;

    constructor() {
        this._prevented = false;
    }

    get prevented() {
        return this._prevented;
    }

    get preventionCause() {
        return this._preventionCause;
    }

    prevent(message?: string) {
        if (!this.prevented) {
            this._prevented = true;
            this._preventionCause = message;
        } else {
            console.log("already prevented");
        }
    }
}