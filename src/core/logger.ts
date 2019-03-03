import { injectable } from "inversify";
import { Initializable } from "./api";

@injectable()
export class Logger implements Initializable {
    
    async init(config: any) { }

    log(...args: any[]) {
        console.log(args.join(' '));
    }
}
