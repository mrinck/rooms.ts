import { World } from "./world";
import { Action } from "./action";

export abstract class Entity {
    id?: string;
    locationId?: string;
    name?: string;
    description?: string;
    world: World;

    readonly type: string;

    constructor(world: World) {
        this.type = this.constructor.name;
        this.world = world;
    }

    onInit(entityDatum: EntityDatum) { }

    onAction(action: Action) {}

    notify(message: string) {}

    toJSON(): EntityDatum | undefined {
        return undefined;
    }
}


export interface EntityClass {
    new(...args: any[]): Entity;
}


export interface EntityDatum {
    id: string;
    type: string;
}

export type EntityData = EntityDatum[];