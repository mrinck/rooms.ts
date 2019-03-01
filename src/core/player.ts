import { Entity } from "./entity";
import { Client } from "./client";
import { World } from "./world";
import { Event } from "./event";
import { MoveEvent } from "../lib/events/move.event";
import { Intent } from "./intent";
import { MoveIntent } from "../lib/intents/move.intent";

export class Player extends Entity {
    name: string;
    client: Client;

    constructor(world: World) {
        super(world);
    }

    onIntent(intent: Intent) {
        if (intent instanceof MoveIntent) {
            if (intent.subject === this) {
                if (intent.prevented) {
                    this.notify(intent.preventionCause);
                }
            }
        }
    }

    onEvent(event: Event) {
        if (event instanceof MoveEvent) {
            if (event.subject === this) {
                this.notify("GOING " + event.direction);
            }
        }
    }

    notify(message?: string) {
        if (message) {
            this.client.write(message);
        }
    }
}