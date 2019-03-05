import { injectable } from "inversify";
import { Initializable } from "./api";
import { Subject, Observable } from "rxjs";
import { Action } from "./action";

@injectable()
export class Dispatcher implements Initializable {
    message: Observable<any>;

    private messageSubject: Subject<any>;

    async init() {
        this.messageSubject = new Subject();
        this.message = this.messageSubject.asObservable();
    }

    dispatch(message: any) {
        this.messageSubject.next(message);
    }
}