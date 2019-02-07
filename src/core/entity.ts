export abstract class Entity {
    id?: string;
    type: string;
    parent: Entity;

    constructor(entityDatum?: EntityDatum) {
        this.type = this.constructor.name;
    }

    abstract load(entityDatum: EntityDatum): void;

    abstract toJSON(): EntityDatum;
}


export interface EntityClass {
    new(entityDatum?: EntityDatum): Entity;
}


export interface EntityDatum {
    id?: string;
    type: string;
}
