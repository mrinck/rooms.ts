import { Subject, Observable, of } from "rxjs";
import { injectable } from "inversify";
import { Initializable } from "./api";

@injectable()
export class Clock implements Initializable {
    ticks: Observable<number>;

    private running: boolean;
    private time: number;
    private ticksSubject: Subject<number>;
    
    async init(config: any) {
        this.time = 0;
        this.ticksSubject = new Subject();
        this.ticks = this.ticksSubject.asObservable();
        this.running = true;
        this.tick();
    }

    stop() {
        this.running = false;
    }

    private tick() {
        this.ticksSubject.next(this.time);
        this.time++;
        if (this.running) {
            setTimeout(() => {
                this.tick();
            }, 250);
        }
    }
}