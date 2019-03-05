import { injectable } from "inversify";
import { Initializable, Config } from "./api";
import { Component, ComponentClass } from "./api";

@injectable()
export class World implements Initializable {
    components: Component[];

    private _config: WorldConfig;

    constructor() { }

    get config() {
        return this._config;
    }

    async init(config: Config) {
        this._config = {
            data: config.world && config.world.data || [],
            components: config.components || []
        };

        this.components = [];

        this.load();

        console.log("[World] loaded");
    }

    private load() {
        for (const datum of this.config.data) {
            if (!datum.hasOwnProperty("#")) {
                const componentClass = this.config.components.find(component => component.name === datum.type);
                if (componentClass) {
                    this.addComponent(new componentClass(datum.entity, datum.value));
                } else {
                    console.log("unknown component", datum.type);
                }
            } else {
                console.log("#", datum["#"]);
            }
        }
    }

    createEntity(): string {
        return this.generateId();
    }

    addComponent(component: Component) {
        console.log("adding", component.constructor.name);
        this.components.push(component);
    }

    getComponent(entity: string, componentClass: ComponentClass): Component | undefined {
        return this.components.find(component => component instanceof componentClass && component.entity === entity);
    }

    getComponentsByClass(componentClass: ComponentClass): Component[] {
        return this.components.filter(component => component instanceof componentClass);
    }

    /**
     * Generate a 16 digit base62 id.
     */
    private generateId(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id = [];
        for (let i = 0; i < 16; i++) {
            const value = Math.floor(Math.random() * 62);
            id.push(chars[value]);
        }
        return id.join("");
    }
}

export interface WorldConfig {
    data: any[];
    components: ComponentClass[];
}