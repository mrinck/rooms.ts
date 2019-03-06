import { run } from "./core/run";
import * as data from "./lib/data/world.json";
import { Application } from "./core/api";
import { Network } from "./core/network";
import { World } from "./core/world";
import { Client } from "./core/client";
import { Dispatcher } from "./core/dispatcher";
import { MoveAction } from "./lib/systems/move/move.action";
import { MoveSystem } from "./lib/systems/move/move.system";
import { LookSystem } from "./lib/systems/look/look.system";
import { QuitAction } from "./lib/systems/quit/quit.action";
import { QuitSystem } from "./lib/systems/quit/quit.system";
import { LookAction } from "./lib/systems/look/look.action";
import { ExitsComponent } from "./lib/components/exits.component";
import { LocationComponent } from "./lib/components/location.component";
import { Message } from "./core/message";
import { NameComponent } from "./lib/components/name.component";
import { DescriptionComponent } from "./lib/components/description.component";
import { filter } from "rxjs/operators";


@run({
    world: data,
    components: [
        DescriptionComponent,
        ExitsComponent,
        LocationComponent,
        NameComponent
    ],
    systems: [
        LookSystem,
        MoveSystem,
        QuitSystem
    ]
})
export class App implements Application {

    constructor(
        private network: Network,
        private world: World,
        private dispatcher: Dispatcher,
        private movementHandler: MoveSystem,
        private lookHandler: LookSystem,
        private quitHandler: QuitSystem
    ) { }

    onInit() {
        this.dispatcher.message.subscribe(message => {
            switch (message.constructor) {
                case LookAction:
                    this.lookHandler.onLookAction(message as LookAction);
                    break;
                case MoveAction:
                    this.movementHandler.onMoveAction(message as MoveAction);
                    break;
                case QuitAction:
                    this.quitHandler.onQuitAction(message as QuitAction);
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

        this.createPlayer(client, name);        
    }

    async createPlayer(client: Client, name: string) {
        const player = this.world.createEntity();

        this.world.addComponent(new NameComponent(player, name));
        this.world.addComponent(new LocationComponent(player, "1"));

        this.dispatcher.message.pipe(filter(message => message instanceof Message && message.entityId === player)).subscribe(message => {
            client.write(message.message);
        });

        this.dispatcher.dispatch(new LookAction(player));

        this.readCommand(client, player);
    }

    async readCommand(client: Client, player: string) {
        try {
            let input = await client.read(">");
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
                        client.write("Unknown command: " + input);
                    }
                    break;
            }

            this.readCommand(client, player);
        } catch (e) {
            // NOOP
        }
    }
}
