import { injectable } from "inversify";
import { Initializable } from "./api";
import { Subject, Observable } from "rxjs";
import { Action } from "./action";

@injectable()
export class Dispatcher implements Initializable {
    action: Observable<Action>;

    private actionSubject: Subject<Action>;

    async init() {
        this.actionSubject = new Subject();
        this.action = this.actionSubject.asObservable();
    }

    dispatch(action: Action) {
        this.actionSubject.next(action);
    }
}