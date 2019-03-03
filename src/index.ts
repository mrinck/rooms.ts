import { run } from "./core/run";
import * as data from "./lib/data/world.json";
import { Room } from "./lib/entities/room";
import { Application } from "./core/api";
import { Network } from "./core/network";
import { World } from "./core/world";
import { Client } from "./core/client";
import { Player } from "./core/player";
import { Dispatcher } from "./core/dispatcher";
import { MoveAction } from "./lib/systems/move/move.action";
import { MoveHandler } from "./lib/systems/move/move.handler";
import { LookHandler } from "./lib/systems/look/look.handler";
import { QuitAction } from "./lib/systems/quit/quit.action";
import { QuitHandler } from "./lib/systems/quit/quit.handler";
import { LookAction } from "./lib/systems/look/look.action";


@run({
    world: {
        data: data,
    },
    entities: [
        Room
    ],
    systems: [
        LookHandler,
        MoveHandler,
        QuitHandler
    ]
})
export class App implements Application {

    constructor(
        private network: Network,
        private world: World,
        private dispatcher: Dispatcher,
        private movementHandler: MoveHandler,
        private lookHandler: LookHandler,
        private quitHandler: QuitHandler
    ) { }

    onInit() {
        this.dispatcher.action.subscribe(action => {
            switch (action.constructor) {
                case LookAction:
                    this.lookHandler.onAction(action as LookAction);
                    break;
                case MoveAction:
                    this.movementHandler.onAction(action as MoveAction);
                    break;
                case QuitAction:
                    this.quitHandler.onAction(action as QuitAction);
                    break;
            }
        });

        this.network.clientConnects.subscribe(client => {
            this.readName(client);
        });
    }

    async readName(client: Client) {
        const name = await client.read("Name");
        client.write("Hi " + name);

        const player = new Player(this.world);
        player.client = client;
        player.name = name;

        this.world.addEntity(player);
        this.dispatcher.dispatch(new LookAction(player));

        this.readCommand(player);
    }

    async readCommand(player: Player) {
        let input = await player.client.read(">");
        input = input.trim();

        switch (input) {
            case "quit":
            this.dispatcher.dispatch(new QuitAction(player));
                break;

            case "l":
            case "look":
                this.dispatcher.dispatch(new LookAction(player));
                break;

            case "n":
            case "north":
                this.dispatcher.dispatch(new MoveAction(player, "north"));
                break;

            case "e":
            case "east":
                this.dispatcher.dispatch(new MoveAction(player, "east"));
                break;

            case "s":
            case "south":
                this.dispatcher.dispatch(new MoveAction(player, "south"));
                break;

            case "w":
            case "west":
                this.dispatcher.dispatch(new MoveAction(player, "west"));
                break;

            default:
                if (input.length > 0) {
                    player.notify("unknown command: " + input);
                }
                break;
        }

        this.readCommand(player);
    }
}
