import { injectable } from "inversify";
import { Application } from "../core/api";
import { Client } from "../core/client";
import { Server } from "../core/server";
import { World } from "../core/world";
import { Player } from "../core/player";

@injectable()
export class App implements Application {

    constructor(
        private server: Server,
        private world: World
    ) { }

    onInit() {
        this.server.clientConnects.subscribe(client => {
            this.readName(client);
        });

        console.log("[Server] listening on port", this.server.config.port);
    }

    async readName(client: Client) {
        const name = await client.read("Name");
        client.write("Hi " + name);

        const player = new Player(client);
        player.name = name;

        this.world.addEntity(player);
        player.client.write(player.parent!.name!);
    }
}
