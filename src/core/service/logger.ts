import { injectable } from "inversify";
import { Initializable } from "../api";
import { Observable, of } from "rxjs";

@injectable()
export class Logger implements Initializable {
    init(config: any): Observable<boolean> {
        return of(true);
    }

    log(...args: any[]) {
        console.log(args.join(' '));
    }
}
