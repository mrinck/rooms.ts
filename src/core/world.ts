import { injectable } from "inversify";
import { Initializable, Config } from "./api";
import { Component, ComponentType, ComponentClass, ComponentData } from "./component";

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
            data: config.world,
            components: config.components || []
        };

        this.components = [];

        this.load();

        console.log("[World] loaded");
    }

    private load() {
        for (const datum of this.config.data.components) {
            const componentClass = this.config.components.find(component => component.name === datum.type);
            if (componentClass) {
                this.addComponent(new componentClass(datum.entity, datum.value, this));
            } else {
                console.log("unknown component", datum.type);
            }
        }
    }

    createEntity(): string {
        return this.generateId();
    }

    addComponent(component: Component) {
        console.log("adding", component.type, ":" ,component.value);
        this.components.push(component);
    }

    getComponent<T extends Component>(entity: string, type: ComponentType<T>): T | undefined {
        return this.components.find(component => component instanceof type && component.entity === entity) as T;
    }

    getComponentsByClass<T extends Component>(type: ComponentType<T>): T[] {
        return this.components.filter(component => component instanceof type) as T[];
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
    data: WorldData;
    components: ComponentClass[];
}

export interface WorldData {
    components: ComponentData[]
}
