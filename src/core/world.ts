import { injectable } from "inversify";
import { Initializable } from "./api";
import { Subject, Observable } from "rxjs";

@injectable()
export class World implements Initializable {

    private initsSubject: Subject<void>;

    init(config: any): Observable<void> {
        this.initsSubject = new Subject();
        
        setTimeout(() => {
            this.initsSubject.next();
        }, 1);

        return this.initsSubject.asObservable();
    }

}