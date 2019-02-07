import { injectable } from "inversify";
import { Application } from "../core/api";
import { Client } from "../core/client";
import { Player } from "./player";
import { Server } from "../core/service/server";
import { World } from "../core/service/world";

@injectable()
export class App implements Application {

    players: Player[];

    constructor(
        private server: Server
    ) { }

    onInit() {
        this.players = [];

        this.server.clientConnects.subscribe(client => {
            this.readName(client);
        });

        console.log("[Server] listening on port", this.server.config.port);
    }

    async readName(client: Client) {
        const name = await client.read("Name");
        client.write("Hi " + name);

        const player = new Player(name, client);
        this.players.push(player);
    }
}
