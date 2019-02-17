import { injectable } from "inversify";
import { Application } from "../core/api";
import { Client } from "../core/client";
import { Server } from "../core/server";
import { World } from "../core/world";
import { Player } from "../core/player";
import { QuitCommand } from "./commands/quit";
import { LookCommand } from "./commands/look";
import { MoveCommand } from "./commands/move";
import { DefaultCommand } from "./commands/default";

@injectable()
export class App implements Application {

    constructor(
        private server: Server,
        private world: World,
        private quitCommand: QuitCommand,
        private lookCommand: LookCommand,
        private moveCommand: MoveCommand,
        private defaultCommand: DefaultCommand
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
        this.lookCommand.execute(player);

        this.readCommand(player);
    }

    async readCommand(player: Player) {
        let input = await player.client.read(">");
        input = input.trim();

        switch (input) {
            case "quit":
                this.quitCommand.execute(player);
                break;

            case "l":
            case "look":
                this.lookCommand.execute(player);
                break;

            case "n":
            case "north":
                this.moveCommand.execute(player, "north");
                break;

            case "e":
            case "east":
                this.moveCommand.execute(player, "east");
                break;

            case "s":
            case "south":
                this.moveCommand.execute(player, "south");
                break;

            case "w":
            case "west":
                this.moveCommand.execute(player, "west");
                break;

            default:
                if (input.length > 0) {
                    this.defaultCommand.execute(player, input);
                }
                break;
        }

        this.readCommand(player);
    }
}
