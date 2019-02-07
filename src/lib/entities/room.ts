import { Entity, EntityDatum } from "../../core/entity";

export class Room extends Entity {

    name?: string;
    description?: string;
    exits: Exit[];

    constructor(roomDatum?: RoomDatum) {
        super();
        this.exits = [];

        if (roomDatum) {
            this.load(roomDatum);
        }
    }

    load(roomDatum: RoomDatum) {
        this.id = roomDatum.id;
        this.description = roomDatum.description;
    }

    addExit(exit: Exit) {
        this.exits.push(exit);
    }

    toJSON(): RoomDatum {
        return {
            id: this.id,
            type: this.type,
            description: this.description,
            exits: this.exits.filter(exit => exit.target.id).map(exit => {
                return { direction: exit.direction, target: exit.target.id! }
            })
        }
    }
}


export interface Exit {
    direction: string;
    target: Entity;
}


export interface RoomDatum extends EntityDatum {
    description?: string,
    exits?: { direction: string, target: string }[]
}