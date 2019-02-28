import { World } from "./world";

export abstract class Entity {
    id?: string;
    location?: Entity;
    name?: string;
    description?: string;
    world: World;

    readonly type: string;

    constructor(world: World) {
        this.type = this.constructor.name;
        this.world = world;
    }


    init(entityDatum: EntityDatum) {};
   
    afterWorldInit(world: World) {}

    toJSON(): EntityDatum | undefined {
        return undefined;
    };
}


export interface EntityClass {
    new(...args: any[]): Entity;
}


export interface EntityDatum {
    id: string;
    type: string;
}

export type EntityData = EntityDatum[];