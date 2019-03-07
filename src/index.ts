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
import { filter, first } from "rxjs/operators";
import { SessionManager, Session } from "./core/sessionManager";
import { PlayerComponent } from "./lib/components/player.component";
import { Subscription } from "rxjs";


@run({
    world: data,
    components: [
        DescriptionComponent,
        ExitsComponent,
        LocationComponent,
        NameComponent,
        PlayerComponent
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
        private quitHandler: QuitSystem,
        private sessionManager: SessionManager
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
        const name = await client.readOnce("Name");
        client.write("Hi " + name);
        
        const currentPlayersComponents = this.world.getComponentsByClass(PlayerComponent);
        const currentPlayerComponent = currentPlayersComponents.find(component => component.value === name);

        if(currentPlayerComponent) {
            // ALREADY IN WORLD
            const currentPlayer = currentPlayerComponent.entity;
            const currentPlayerSession = this.sessionManager.getSessionForPlayer(currentPlayer);

            if (currentPlayerSession) {
                if(currentPlayerSession.client.isAlive()) {
                    // already coonnected
                    client.write("Already connected.");
                    client.disconnect();
                } else {
                    // reconnect
                    client.write("Reconnected.");
                    currentPlayerSession.get<Subscription>("messageSubscription").unsubscribe();
                    currentPlayerSession.get<Subscription>("inputSubscription").unsubscribe();
                    currentPlayerSession.client = client;

                    this.initSession(currentPlayerSession);
                }
            }
        } else {
            this.createPlayer(client, name);
        }
    }

    async createPlayer(client: Client, name: string) {
        const player = this.world.createEntity();
        this.world.addComponent(new PlayerComponent(player, name));
        this.world.addComponent(new NameComponent(player, name));
        this.world.addComponent(new LocationComponent(player, "1"));

        const session = this.sessionManager.createSession(player, client);

        session.destroys.pipe(first()).subscribe(() => {
            session.get<Subscription>("messageSubscription").unsubscribe();
            session.get<Subscription>("inputSubscription").unsubscribe();
            session.client.disconnect();
            this.world.removeComponents(session.player);
        });

        this.initSession(session);

        this.dispatcher.dispatch(new LookAction(player));
    }

    async initSession(session: Session) {

        session.data["messageSubscription"] = this.dispatcher.message.pipe(filter(message => message instanceof Message && message.entityId === session.player)).subscribe(message => {
            session.client.write(message.message);
        });

        session.data["inputSubscription"] = session.client.messages.subscribe(input => {
            console.log("receiving input", input);
            input = input.trim();

            switch (input) {
                case "quit":
                    this.dispatcher.dispatch(new QuitAction(session.player));
                    break;

                case "l":
                case "look":
                    this.dispatcher.dispatch(new LookAction(session.player));
                    break;

                case "n":
                case "north":
                    this.dispatcher.dispatch(new MoveAction(session.player, "north"));
                    break;

                case "e":
                case "east":
                    this.dispatcher.dispatch(new MoveAction(session.player, "east"));
                    break;

                case "s":
                case "south":
                    this.dispatcher.dispatch(new MoveAction(session.player, "south"));
                    break;

                case "w":
                case "west":
                    this.dispatcher.dispatch(new MoveAction(session.player, "west"));
                    break;

                default:
                    if (input.length > 0) {
                        session.client.write("Unknown command: " + input);
                    }
                    break;
            }
        });
    }
}
