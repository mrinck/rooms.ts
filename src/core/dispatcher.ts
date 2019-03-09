import { injectable } from "inversify";
import { OnInit } from "./api";
import { Subject, Observable } from "rxjs";

@injectable()
export class Dispatcher implements OnInit {
    message: Observable<any>;

    private messageSubject: Subject<any>;

    onInit() {
        this.messageSubject = new Subject();
        this.message = this.messageSubject.asObservable();
    }

    dispatch(message: any) {
        this.messageSubject.next(message);
    }
}