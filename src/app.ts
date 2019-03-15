import { app } from "./core/app";
import * as data from "./lib/data/world.json";
import { Network } from "./core/network";
import { ComponentManager } from "./core/componentManager";
import { Client } from "./core/client";
import { EventManager } from "./core/eventManager";
import { MoveAction } from "./lib/actions/move.action";
import { MovementSystem } from "./lib/systems/movement.system";
import { LookSystem } from "./lib/systems/look.system";
import { QuitAction } from "./lib/actions/quit.action";
import { SessionSystem } from "./lib/systems/session.system";
import { LookAction } from "./lib/actions/look.action";
import { LocationComponent } from "./lib/components/location.component";
import { Message } from "./core/message";
import { NameComponent } from "./lib/components/name.component";
import { filter, first } from "rxjs/operators";
import { SessionManager, Session } from "./core/sessionManager";
import { PlayerComponent } from "./lib/components/player.component";
import { Subscription } from "rxjs";
import { SessionStartEvent } from "./lib/events/sessionStart.event";

@app({
    world: data,
    systems: [
        LookSystem,
        MovementSystem,
        SessionSystem
    ]
})
export class App {

    constructor(
        private network: Network,
        private componentManager: ComponentManager,
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

        const currentPlayersComponents = this.componentManager.getAllComponentsOfType(PlayerComponent);
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

        const player = this.componentManager.createEntity();
        this.componentManager.addComponent(new PlayerComponent(player, name));
        this.componentManager.addComponent(new NameComponent(player, name));
        this.componentManager.addComponent(new LocationComponent(player, "1"));

        const session = this.sessionManager.createSession(player, client);

        session.destroys.pipe(first()).subscribe(() => {
            session.get<Subscription>("messageSubscription").unsubscribe();
            session.get<Subscription>("inputSubscription").unsubscribe();
            session.client.disconnect();
            this.componentManager.removeComponents(session.player);
        });

        this.initSession(session);

        this.eventManager.send(new SessionStartEvent(player));
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
