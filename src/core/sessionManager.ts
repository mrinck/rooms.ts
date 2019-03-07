import { injectable } from "inversify";
import { Client } from "./client";
import { Initializable } from "./api";
import { Subject, Observable } from "rxjs";
import { first } from "rxjs/operators";

@injectable()
export class SessionManager implements Initializable {
    sessions: Session[];
    authenticates: Observable<string>;

    private authenticatesSubject: Subject<string>;

    constructor() { }

    async init() {
        this.sessions = [];
        this.authenticatesSubject = new Subject();
        this.authenticates = this.authenticatesSubject.asObservable();
        return;
    }

    authenticate(name: string) {
        this.authenticatesSubject.next(name);
    }

    createSession(player: string, client: Client): Session {
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

    getSessionForPlayer(player: string): Session | undefined {
        return this.sessions.find(session => session.player === player);
    }

    getSessionForClient(client: Client): Session | undefined {
        return this.sessions.find(session => session.client === client);
    }
}

export class Session {
    player: string;
    data: { [key: string]: any};
    destroys: Observable<void>;
    resets: Observable<void>;
    client: Client;
    private destroysSubject: Subject<void>;
    private resetsSubject: Subject<void>;

    constructor(player: string, client: Client) {
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