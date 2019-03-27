import { injectable } from "inversify";
import { OnInit } from "./api";
import { EventManager } from "./eventManager";
import { TickEvent } from "./events/tick.event";

@injectable()
export class Clock implements OnInit {
    private running: boolean;
    private time: number;

    constructor(
        private eventManager: EventManager
    ) { }

    onInit() {
        this.time = 0;
        this.running = true;
        this.tick();
    }

    stop() {
        this.running = false;
    }

    private tick() {
        this.eventManager.send(new TickEvent(this.time));
        this.time++;
        if (this.running) {
            setTimeout(() => {
                this.tick();
            }, 250);
        }
    }
}