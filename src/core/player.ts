import { Entity } from "./entity";
import { Client } from "./client";

export class Player extends Entity {
    name: string;
    client: Client;

    constructor(client: Client) {
        super();
        this.client = client;
    }
}