import { injectable } from "inversify";
import { config } from "./config";
import { OnInit, Entity } from "./api";
import { Component, ComponentType } from "./component";

@injectable()
export class ComponentManager implements OnInit {
    components: Component[];

    constructor() { }

    async onInit() {
        this.components = [];

        this.load();

        console.log("[World] loaded");
    }

    private load() {
        for (const datum of config.world.components) {
            const componentType = config.componentTypes.find(component => component.name === datum.type);
            if (componentType) {
                this.addComponent(new componentType(datum.entity, datum.value, this));
            } else {
                console.log("unknown component", datum.type);
            }
        }
    }

    createEntity(): Entity {
        return this.generateId();
    }

    addComponent(component: Component) {
        console.log("[World] adding", component.type, "@" ,component.entity);
        this.components.push(component);
    }

    getComponent<T extends Component>(entity: Entity, type: ComponentType<T>): T | undefined {
        return this.components.find(component => component instanceof type && component.entity === entity) as T;
    }

    removeComponents(entity: Entity) {
        let i = this.components.length;
        while (i--) {
            if (this.components[i].entity === entity) {
                console.log("[World] removing", this.components[i].type, "@", entity);
                this.components.splice(i, 1);
            }
        }
    }

    getAllComponentsOfType<T extends Component>(type: ComponentType<T>): T[] {
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
