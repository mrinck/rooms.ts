export abstract class Action {

    private _prevented = false;

    get prevented() {
        return this._prevented;
    }

    prevent() {
        this._prevented = true;
    }

}

export interface ActionClass {
    new(...params: any[]): Action;
}