import * as WebSocket from "ws";
import * as Http from "http";
import { Client } from "./client";
import { Observable, Subject } from "rxjs";
import { first } from "rxjs/operators";
import { injectable } from "inversify";
import { Initializable } from "./api";
import { Logger } from "./logger";

@injectable()
export class Server implements Initializable {
    clients: Client[];
    clientConnects: Observable<Client>;

    private port: number;
    private _config: ServerConfig;
    private http: Http.Server;
    private socket: WebSocket.Server;
    private clientConnectsSubject: Subject<Client>;
    private initsSubject: Subject<number>;

    constructor(
        private logger: Logger
    ) { }

    init(config: ServerConfig): Observable<number> {
        this._config = {
            port: config.port || 8080
        };

        this.clientConnectsSubject = new Subject();
        this.clientConnects = this.clientConnectsSubject.asObservable();
        this.initsSubject = new Subject();
        this.http = Http.createServer();
        this.http.listen();
        this.socket = new WebSocket.Server({ server: this.http, port: this.config.port });
        this.clients = [];

        this.socket.on("connection", connection => {
            const client = new Client(connection);
            this.clients.push(client);
            this.clientConnectsSubject.next(client);

            client.disconnects.pipe(first()).subscribe(() => {
                this.removeClient(client);
            });
        });

        this.socket.on("listening", () => {
            this.initsSubject.next(this.socket.options.port);
        });

        return this.initsSubject.asObservable();
    }

    get config() {
        return this._config;
    }

    stop() {
        this.http.close();
        this.socket.close();
    }

    private removeClient(client: Client) {
        const index = this.clients.indexOf(client);
        if (index != -1) {
            this.clients.splice(index, 1);
        }
    }

}

export interface ServerConfig {
    port?: number;
}