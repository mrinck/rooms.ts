export abstract class Action {

    private _prevented = false;
    private _preventionMessage: string;

    get prevented() {
        return this._prevented;
    }

    get preventionMessage() {
        return this._preventionMessage;
    }

    prevent(message?: string) {
        this._prevented = true;
    }

}