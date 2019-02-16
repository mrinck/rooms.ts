import { Entity, EntityDatum } from "../../core/entity";
import { World } from "../../core/world";

export class Room extends Entity {
    name?: string;
    description?: string;
    exits: Exit[];
    datum: RoomDatum;

    constructor() {
        super();
        this.exits = [];
    }

    init(roomDatum: RoomDatum) {
        this.datum = roomDatum;

        this.id = roomDatum.id;
        this.name = roomDatum.name;
        this.description = roomDatum.description;
    }

    afterWorldInit(world: World) {
        for (const exitDatum of this.datum.exits) {
            const targetId = exitDatum.target.substr(1);
            const target = world.findEntityById(targetId);
            if (target) {
                this.addExit({
                    direction: exitDatum.direction,
                    target: target
                });
            }
        }
    }

    addExit(exit: Exit) {
        this.exits.push(exit);
    }

    toJSON(): RoomDatum {
        return {
            id: this.id!,
            type: this.type,
            description: this.description,
            exits: this.exits.filter(exit => exit.target.id).map(exit => {
                return {
                    direction: exit.direction,
                    target: '@' + exit.target.id!
                }
            })
        }
    }
}


export interface Exit {
    direction: string;
    target: Entity;
}


export interface RoomDatum extends EntityDatum {
    name?: string;
    description?: string,
    exits: { direction: string, target: string }[]
}