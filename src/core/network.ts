import * as WebSocket from "ws";
import * as Http from "http";
import { config } from "./config";
import { Client } from "./client";
import { Observable, Subject } from "rxjs";
import { first } from "rxjs/operators";
import { injectable } from "inversify";
import { OnInit } from "./api";
import { Logger } from "./logger";

@injectable()
export class Network implements OnInit {
    clients: Client[];
    clientConnects: Observable<Client>;

    private http: Http.Server;
    private socket: WebSocket.Server;
    private clientConnectsSubject: Subject<Client>;
    private initsSubject: Subject<number>;

    constructor(
        private logger: Logger
    ) { }

    onInit() {
        this.clientConnectsSubject = new Subject();
        this.clientConnects = this.clientConnectsSubject.asObservable();
        this.initsSubject = new Subject();
        this.http = Http.createServer();
        this.http.listen();
        this.socket = new WebSocket.Server({ server: this.http, port: config.network!.port! });
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
            console.log("[Server] listening on port", config.network!.port!);
            this.initsSubject.next(this.socket.options.port);
        });

        return this.initsSubject.pipe(first()).toPromise();
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

export interface NetworkConfig {
    port?: number;
}