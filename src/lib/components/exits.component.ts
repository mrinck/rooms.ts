import { Component } from "../../core/component";

export class ExitsComponent extends Component {
    value: Exit[];

    constructor(entity: string, value: Exit[]) {
        super(entity, value);
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
