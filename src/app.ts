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
import { LocationComponent } from "./core/components/location.component";
import { NameComponent } from "./lib/components/name.component";
import { filter, first } from "rxjs/operators";
import { SessionManager, Session } from "./core/sessionManager";
import { PlayerComponent } from "./core/components/player.component";
import { Subscription } from "rxjs";
import { SessionStartEvent } from "./lib/events/sessionStart.event";
import { SpeechSystem } from "./lib/systems/speech.system";
import { SayAction } from "./lib/actions/say.action";
import { SystemManager } from "./core/systemManager";
import { CommandManager } from "./core/commandManager";
import { UnknownAction } from "./lib/actions/unknown.action";
import { HelpSystem } from "./lib/systems/help.system";
import { HelpAction } from "./lib/actions/help.action";
import { MessageEvent } from "./core/events/message.event";
import { OnInit } from "./core/api";
import { ExamineAction } from "./lib/actions/examine.action";
import { ShutdownAction } from "./lib/actions/shutdown.action";
import { DigAction } from "./lib/actions/dig.action";
import { CreationSystem } from "./lib/systems/creation.system";

@app()
export class App implements OnInit {

    constructor(
        private network: Network,
        private commandManager: CommandManager,
        private componentManager: ComponentManager,
        private eventManager: EventManager,
        private sessionManager: SessionManager,
        private systemManager: SystemManager,
        private lookSystem: LookSystem,
        private movementSystem: MovementSystem,
        private sessionSystem: SessionSystem,
        private speechSystem: SpeechSystem,
        private helpSystem: HelpSystem,
        private creationSystem: CreationSystem
    ) { }

    onInit() {
        this.componentManager.load(data);

        this.commandManager.configure([
            {
                command: "n[orth]",
                action: (player, params) => new MoveAction(player, "north")
            },
            {
                command: "e[ast]",
                action: (player, params) => new MoveAction(player, "east")
            },
            {
                command: "s[outh]",
                action: (player, params) => new MoveAction(player, "south")
            },
            {
                command: "w[est]",
                action: (player, params) => new MoveAction(player, "west")
            },
            {
                command: "u[p]",
                action: (player, params) => new MoveAction(player, "up")
            },
            {
                command: "d[own]",
                action: (player, params) => new MoveAction(player, "down")
            },
            {
                command: "go [to] [the] :direction",
                action: (player, params) => new MoveAction(player, params["direction"])
            },
            {
                command: "l[ook]",
                action: (player, params) => new LookAction(player)
            },
            {
                command: "(examine|look at) [the] :target",
                action: (player, params) => new ExamineAction(player, params["target"])
            },
            {
                command: "say :message",
                action: (player, params) => new SayAction(player, params["message"])
            },
            {
                command: "::message",
                action: (player, params) => new SayAction(player, params["message"])
            },
            {
                command: "quit",
                action: (player, params) => new QuitAction(player)
            },
            {
                command: "help",
                action: (player, params) => new HelpAction(player)
            },
            {
                command: "shutdown",
                action: (player, params) => new ShutdownAction(player)
            },
            {
                command: "dig :direction",
                action: (player, params) => new DigAction(player, params["direction"])
            },
            {
                command: ":else",
                action: (player, params) => new UnknownAction(player, params["else"])
            }
        ]);

        this.systemManager.configure({
            systems: [
                this.lookSystem,
                this.sessionSystem,
                this.movementSystem,
                this.speechSystem,
                this.helpSystem,
                this.creationSystem
            ],
            actionHandlers: [
                {
                    action: ExamineAction,
                    handlers: [this.lookSystem]
                },
                {
                    action: LookAction,
                    handlers: [this.lookSystem]
                },
                {
                    action: MoveAction,
                    handlers: [this.movementSystem]
                },
                {
                    action: QuitAction,
                    handlers: [this.sessionSystem]
                },
                {
                    action: SayAction,
                    handlers: [this.speechSystem]
                },
                {
                    action: HelpAction,
                    handlers: [this.helpSystem]
                },
                {
                    action: ShutdownAction,
                    handlers: [this.sessionSystem]
                },
                {
                    action: DigAction,
                    handlers: [this.creationSystem]
                },
                {
                    action: UnknownAction,
                    handlers: [this.helpSystem]
                }
            ]
        });

        this.network.clientConnects.subscribe(client => {
            this.readName(client);
        });
    }

    async readName(client: Client) {
        const name = await client.readOnce("Name");

        const presentPlayersComponents = this.componentManager.getAllComponentsOfType(PlayerComponent);
        const currentPlayerComponent = presentPlayersComponents.find(component => component.value === name);

        if (currentPlayerComponent) {
            // player already in world
            const currentPlayer = currentPlayerComponent.entity;
            const currentPlayerSession = this.sessionManager.getSessionForPlayer(currentPlayer);

            if (currentPlayerSession) {
                if (currentPlayerSession.client.isAlive()) {
                    // connection active. bye.
                    client.write("Already connected.");
                    client.disconnect();
                } else {
                    // connection dead. reconnect.
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
        session.data["messageSubscription"] = this.eventManager.message.pipe(filter(message => message instanceof MessageEvent && message.entity === session.player)).subscribe(message => {
            session.client.write(message.message);
        });

        session.data["inputSubscription"] = session.client.messages.subscribe(input => {
            input = input.trim();
            if (input.length > 0) {
                this.commandManager.parse(session.player, input);
            }
        });
    }
}

