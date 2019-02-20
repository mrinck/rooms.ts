import { run } from "./core/run";
import { Room } from "./lib/entities/room";
import { QuitCommand } from "./lib/commands/quit";
import { LookCommand } from "./lib/commands/look";
import { MoveCommand } from "./lib/commands/move";
import { DefaultCommand } from "./lib/commands/default";
import { Application } from "./core/api";
import { Network } from "./core/network";
import { World } from "./core/world";
import { Client } from "./core/client";
import { Player } from "./core/player";


@run({
    world: {
        file: __dirname + "/lib/data/world.json",
    },
    entities: [
        Room
    ],
    commands: [
        DefaultCommand,
        LookCommand,
        MoveCommand,
        QuitCommand
    ]
})
export class App implements Application {

    constructor(
        private network: Network,
        private world: World,
        private lookCommand: LookCommand,
        private moveCommand: MoveCommand,
        private quitCommand: QuitCommand,
        private defaultCommand: DefaultCommand
    ) { }

    onInit() {
        this.network.clientConnects.subscribe(client => {
            this.readName(client);
        });
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
