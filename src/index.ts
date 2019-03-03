import { run } from "./core/run";
import * as data from "./lib/data/world.json";
import { Room } from "./lib/entities/room";
import { Application } from "./core/api";
import { Network } from "./core/network";
import { World } from "./core/world";
import { Client } from "./core/client";
import { Player } from "./core/player";
import { Dispatcher } from "./core/dispatcher";
import { MoveAction } from "./lib/actions/move.action";
import { LookAction } from "./lib/actions/look.action";
import { MovementHandler } from "./lib/handlers/movement.handler";
import { PerceptionHandler } from "./lib/handlers/perception.handler";
import { QuitAction } from "./lib/actions/quit.action";
import { QuitHandler } from "./lib/handlers/quit.handler";


@run({
    world: {
        data: data,
    },
    entities: [
        Room
    ],
    systems: [
        MovementHandler,
        PerceptionHandler,
        QuitHandler
    ]
})
export class App implements Application {

    constructor(
        private network: Network,
        private world: World,
        private dispatcher: Dispatcher,
        private movementHandler: MovementHandler,
        private perceptionHandler: PerceptionHandler,
        private quitHandler: QuitHandler
    ) { }

    onInit() {
        this.dispatcher.action.subscribe(action => {
            switch (action.constructor) {
                case LookAction:
                    this.perceptionHandler.onAction(action as LookAction);
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
