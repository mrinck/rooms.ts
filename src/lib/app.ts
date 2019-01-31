import { Application } from "../core/api";
import { injectable } from "inversify";
import { Server } from "../core/server";
import { Player } from "./player";
import { Client } from "../core/client";

@injectable()
export class App implements Application {
    
    players: Player[];

    constructor(
        private server: Server
    ) {}

    onInit() {
        this.server.clientConnects.subscribe(client => {
            console.log("client connected");
            this.readName(client);
        });
    }

    async readName(client: Client) {
        client.write("Name");
        const name = await client.read();
        client.write("Hi " + name);

        const player = new Player(name, client);
        this.players.push(player);
    }
}