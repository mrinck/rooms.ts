import { config } from "./config";
import { Subject, Observable } from "rxjs";
import { injectable } from "inversify";
import { OnInit } from "./api";

@injectable()
export class Clock implements OnInit {
    ticks: Observable<number>;

    private running: boolean;
    private time: number;
    private ticksSubject: Subject<number>;
    
    onInit() {
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