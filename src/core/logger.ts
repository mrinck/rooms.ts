import { injectable } from "inversify";
import { OnInit } from "./api";

@injectable()
export class Logger implements OnInit {
    
    onInit() { }

    log(...args: any[]) {
        console.log(args.join(' '));
    }
}
