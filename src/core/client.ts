import * as WebSocket from "ws";
import { Observable, Subject } from "rxjs";

export class Client {
    messages: Observable<string>;
    disconnects: Observable<void>;
    
    private lastActivity: number;
    private connection: WebSocket;
    private readers: any[];
    private messagesSubject: Subject<string>;

    constructor(connection: WebSocket) {
        this.connection = connection;
        this.lastActivity = Date.now();
        this.messagesSubject = new Subject();
        this.messages = this.messagesSubject.asObservable();
        this.readers = [];

        this.connection.on("message", (input: string) => {
            this.lastActivity = Date.now();
            this.messagesSubject.next(input);
            
            if (this.readers.length > 0) {
                const reader = this.readers.pop();
                reader(input);
            }
        });

        this.disconnects = new Observable(observer => {
            this.connection.on("close", () => {
                observer.next();
            });
        });
    }

    read(message?: string): Promise<string> {
        if (message) {
            this.write(message);
        }

        return new Promise(resolve => {
            const reader = (input: string) => resolve(input);
            this.readers.push(reader);
        });
    }

    write(message: string) {
        this.connection.send(message);
    }

    disconnect() {
        this.connection.terminate();
    }

    isAlive(): boolean {
        return this.connection.readyState == WebSocket.OPEN;
    }

    getIdleTime(): number {
        return Date.now() - this.lastActivity;
    }
}
