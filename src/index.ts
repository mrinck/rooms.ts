import { run } from "./core/run";
import { App } from "./lib/app";

const config = {
    server: {
        port: 8080
    }
};

run(App, config);
