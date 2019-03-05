import { Component } from "../../core/api";

export class ExitsComponent implements Component {
    entityId: string;
    value: Exit[];

    constructor(entityId: string, value: Exit[]) {
        this.entityId = entityId;
        this.value = value;
    }

    addExit(exit: Exit) {
        this.value.push(exit);
    }

    getExitTargetIdInDirection(direction?: string): string | undefined {
        if (direction) {
            for (const exit of this.value) {
                if (exit.direction === direction) {
                    return exit.targetId;
                }
            }
        }
    }

    getExitDirectionOfTargetId(targetId?: string): string | undefined {
        if (targetId) {
            for (const exit of this.value) {
                if (exit.targetId === targetId) {
                    return exit.direction;
                }
            }
        }
    }

    getExitDirections(): string[] {
        return this.value.map(exit => exit.direction);
    }

    getExitTargetIds(): string[] {
        return this.value.map(exit => exit.targetId);
    }
}

export interface Exit {
    direction: string;
    targetId: string;
}


export interface ExitsComponentData {
    entityId: string;
    value: Exit[];
}