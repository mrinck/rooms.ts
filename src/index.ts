import { run } from "./core/run";
import { Config } from "./core/api";
import { App } from "./lib/app";
import { Room } from "./lib/entities/room";
import { QuitCommand } from "./lib/commands/quit";
import { LookCommand } from "./lib/commands/look";
import { MoveCommand } from "./lib/commands/move";
import { DefaultCommand } from "./lib/commands/default";

const config: Config = {
    world: {
        file: __dirname + "/lib/data/world.json",
        entityClasses: [
            Room
        ]
    },
    commands: [
        DefaultCommand,
        LookCommand,
        MoveCommand,
        QuitCommand
    ]
};

run(App, config);
