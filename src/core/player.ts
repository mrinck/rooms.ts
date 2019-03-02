import { Entity } from "./entity";
import { Client } from "./client";
import { World } from "./world";

export class Player extends Entity {
    name: string;
    client: Client;

    constructor(world: World) {
        super(world);
    }

    notify(message?: string) {
        if (message) {
            this.client.write(message);
        }
    }
}