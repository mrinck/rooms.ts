import { run } from "./core/run";
import { Config } from "./core/api";
import { App } from "./lib/app";
import { Room } from "./lib/entities/room";

const config: Config = {
    world: {
        file: __dirname + "/lib/data/world.json",
        entityClasses: [
            Room
        ]
    }
};

run(App, config);
