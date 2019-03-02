import { Entity, EntityDatum } from "../../core/entity";
import { World } from "../../core/world";

export class Room extends Entity {
    name?: string;
    description?: string;
    exits: Exit[];

    constructor(world: World) {
        super(world);
        this.exits = [];
    }

    onInit(roomDatum: RoomDatum) {
        this.id = roomDatum.id;
        this.name = roomDatum.name;
        this.description = roomDatum.description;
        this.exits = roomDatum.exits;
    }

    addExit(exit: Exit) {
        this.exits.push(exit);
    }

    getExitTargetIdInDirection(direction: string): string | undefined {
        for (const exit of this.exits) {
            if (exit.direction === direction) {
                return exit.targetId;
            }
        }
    }

    getExitDirections(): string[] {
        return this.exits.map(exit => exit.direction);
    }

    getExitTargetIds(): string[] {
        return this.exits.map(exit => exit.targetId);
    }

    toJSON(): RoomDatum {
        return {
            id: this.id!,
            type: this.type,
            description: this.description,
            exits: this.exits
        }
    }
}

export interface Exit {
    direction: string;
    targetId: string;
}

export interface RoomDatum extends EntityDatum {
    name?: string;
    description?: string,
    exits: Exit[]
}