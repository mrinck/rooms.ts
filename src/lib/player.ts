import { Client } from "../core/client";

export class Player {
    name: string;
    client: Client;

    constructor(name: string, client: Client) {
        this.name = name;
        this.client = client;
    }
}