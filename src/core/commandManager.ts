import { injectable } from "inversify";
import { Parser } from "./parser";
import { OnInit, Entity } from "./api";
import { SystemManager } from "./systemManager";

@injectable()
export class CommandManager implements OnInit {
    commandParsers: CommandParser[];

    constructor(
        private systemManager: SystemManager
    ) { }

    onInit() {
        this.commandParsers = [];
    }

    configure(configs: CommandConfig[]) {
        for (const config of configs) {
            this.configureCommand(config);
        }
    }

    configureCommand(config: CommandConfig) {
        const parser = new Parser(config.command);
        this.commandParsers.push({
            parser: parser,
            action: config.action
        });
    }

    parse(player: Entity, input: string) {
        for (const commandParser of this.commandParsers) {
            const result = commandParser.parser.match(input);
            if (result.matching) {
                const action = commandParser.action(player, result.params);
                this.systemManager.execute(action);
                return;
            }
        }
    }
}

export interface CommandConfig {
    command: string;
    action: (player: Entity, params: any) => any;
}

export interface CommandParser {
    parser: Parser;
    action: (player: Entity, params: any) => any;
}