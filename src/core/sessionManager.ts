import { injectable } from "inversify";
import { Client } from "./client";
import { OnInit, Entity } from "./api";
import { Subject, Observable } from "rxjs";
import { first } from "rxjs/operators";

@injectable()
export class SessionManager implements OnInit {
    sessions: Session[];
    authenticates: Observable<string>;

    private authenticatesSubject: Subject<string>;

    constructor() { }

    onInit() {
        this.sessions = [];
        this.authenticatesSubject = new Subject();
        this.authenticates = this.authenticatesSubject.asObservable();
    }

    authenticate(name: string) {
        this.authenticatesSubject.next(name);
    }

    createSession(player: Entity, client: Client): Session {
        console.log("CREATING SESSION");
        const session = new Session(player, client);
        this.sessions.push(session);

        session.destroys.pipe(first()).subscribe(() => this.destroySession(session));

        return session;
    }

    destroySession(session: Session) {
        console.log("DESTROYING SESSION");

        const index = this.sessions.indexOf(session);

        if (index) {
            this.sessions.splice(index, 1);
        }
    }

    getSessionForPlayer(player: Entity): Session | undefined {
        return this.sessions.find(session => session.player === player);
    }

    getSessionForClient(client: Client): Session | undefined {
        return this.sessions.find(session => session.client === client);
    }
}

export class Session {
    player: Entity;
    data: { [key: string]: any};
    destroys: Observable<void>;
    resets: Observable<void>;
    client: Client;
    private destroysSubject: Subject<void>;
    private resetsSubject: Subject<void>;

    constructor(player: Entity, client: Client) {
        this.player = player;
        this.client = client;
        this.destroysSubject = new Subject();
        this.resetsSubject = new Subject();
        this.destroys = this.destroysSubject.asObservable();
        this.resets = this.resetsSubject.asObservable();
        this.data = {};
    }

    destroy() {
        this.destroysSubject.next();
    }

    reset() {
        this.resetsSubject.next();
    }

    get<T>(key: string): T {
        return this.data[key];
    }

    set(key: string, value: any) {
        this.data[key] = value;
    }

    unset(key: string) {
        delete this.data[key];
    }
}