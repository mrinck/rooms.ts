import { injectable } from "inversify";
import { Application } from "../core/api";
import { Server } from "../core/server";
import { Client } from "../core/client";
import { Player } from "./player";

@injectable()
export class App implements Application {
    
    players: Player[];

    constructor(
        private server: Server
    ) {}

    onInit() {
        console.log("Server listening on port", this.server.config.port);

        this.server.clientConnects.subscribe(client => {
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