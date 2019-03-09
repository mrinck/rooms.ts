import { app } from "./core/app";
import * as data from "./lib/data/world.json";
import { Network } from "./core/network";
import { EntityManager } from "./core/entityManager";
import { Client } from "./core/client";
import { EventManager } from "./core/eventManager";
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


@app({
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
export class App {

    constructor(
        private network: Network,
        private entityManager: EntityManager,
        private eventManager: EventManager,
        private sessionManager: SessionManager
    ) { }

    onInit() {
        this.network.clientConnects.subscribe(client => {
            this.readName(client);
        });
    }

    async readName(client: Client) {
        const name = await client.readOnce("Name");

        const currentPlayersComponents = this.entityManager.getComponentsByClass(PlayerComponent);
        const currentPlayerComponent = currentPlayersComponents.find(component => component.value === name);

        if (currentPlayerComponent) {
            // ALREADY IN WORLD
            const currentPlayer = currentPlayerComponent.entity;
            const currentPlayerSession = this.sessionManager.getSessionForPlayer(currentPlayer);

            if (currentPlayerSession) {
                if (currentPlayerSession.client.isAlive()) {
                    // already connected
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

    createPlayer(client: Client, name: string) {
        client.write("Hi " + name);

        const player = this.entityManager.createEntity();
        this.entityManager.addComponent(new PlayerComponent(player, name));
        this.entityManager.addComponent(new NameComponent(player, name));
        this.entityManager.addComponent(new LocationComponent(player, "1"));

        const session = this.sessionManager.createSession(player, client);

        session.destroys.pipe(first()).subscribe(() => {
            session.get<Subscription>("messageSubscription").unsubscribe();
            session.get<Subscription>("inputSubscription").unsubscribe();
            session.client.disconnect();
            this.entityManager.removeComponents(session.player);
        });

        this.initSession(session);

        this.eventManager.send(new LookAction(player));
    }

    initSession(session: Session) {
        session.data["messageSubscription"] = this.eventManager.message.pipe(filter(message => message instanceof Message && message.entityId === session.player)).subscribe(message => {
            session.client.write(message.message);
        });

        session.data["inputSubscription"] = session.client.messages.subscribe(input => {
            input = input.trim();

            switch (input) {
                case "quit":
                    this.eventManager.send(new QuitAction(session.player));
                    break;

                case "l":
                case "look":
                    this.eventManager.send(new LookAction(session.player));
                    break;

                case "n":
                case "north":
                    this.eventManager.send(new MoveAction(session.player, "north"));
                    break;

                case "e":
                case "east":
                    this.eventManager.send(new MoveAction(session.player, "east"));
                    break;

                case "s":
                case "south":
                    this.eventManager.send(new MoveAction(session.player, "south"));
                    break;

                case "w":
                case "west":
                    this.eventManager.send(new MoveAction(session.player, "west"));
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
