import { World } from "./world";

export abstract class Entity {
    id?: string;
    location?: Entity;
    name?: string;
    description?: string;

    readonly type: string;

    constructor() {
        this.type = this.constructor.name;
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
