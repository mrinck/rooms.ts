import { Entity, EntityDatum } from "../../core/entity";
import { World } from "../../core/world";

export class Room extends Entity {
    name?: string;
    description?: string;
    exits: Exit[];
    datum: RoomDatum;

    constructor(world: World) {
        super(world);
        this.exits = [];
    }

    init(roomDatum: RoomDatum) {
        this.datum = roomDatum;

        this.id = roomDatum.id;
        this.name = roomDatum.name;
        this.description = roomDatum.description;
    }

    addExit(exit: Exit) {
        this.exits.push(exit);
    }

    getRoomInDirection(direction: string): Promise<Room> {
        return new Promise((resolve, reject) => {
            let result;
            for (const exit of this.exits) {
                if (exit.direction === direction) {
                    const room = this.world.getEntity(exit.roomId);
                    if (room) {
                        result = room;
                    }
                    break;
                }
            }
        });
    }

    getExitDirections(): string[] {
        return this.exits.map(exit => exit.direction);
    }

    getExitTargets(): string[] {
        return this.exits.map(exit => exit.roomId);
    }

    toJSON(): RoomDatum {
        return {
            id: this.id!,
            type: this.type,
            description: this.description,
            exits: this.exits.filter(exit => exit.roomId).map(exit => {
                return {
                    direction: exit.direction,
                    room_id: exit.roomId!
                }
            })
        }
    }
}


export interface Exit {
    direction: string;
    roomId: string;
}


export interface RoomDatum extends EntityDatum {
    name?: string;
    description?: string,
    exits: { direction: string, room_id: string }[]
}