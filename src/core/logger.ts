import { injectable } from "inversify";
import { Initializable } from "./api";
import { Observable, Subject } from "rxjs";

@injectable()
export class Logger implements Initializable {

    private initsSubject: Subject<void>;

    init(config: any): Observable<void> {
        this.initsSubject = new Subject();
        
        setTimeout(() => {
            this.initsSubject.next();
        }, 1);

        return this.initsSubject.asObservable();
    }

    log(...args: any[]) {
        console.log(args.join(' '));
    }

}