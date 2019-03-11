import { Component } from "../../core/component";
import { Entity } from "../../core/api";

export class ExitsComponent extends Component {
    value: Exit[];

    constructor(entity: string, value: Exit[]) {
        super(entity, value);
    }

    addExit(exit: Exit) {
        this.value.push(exit);
    }

    getTargetForDirection(direction?: string): Entity | undefined {
        if (direction) {
            for (const exit of this.value) {
                if (exit.direction === direction) {
                    return exit.target;
                }
            }
        }
    }

    getDirectionForTarget(targetId?: string): string | undefined {
        if (targetId) {
            for (const exit of this.value) {
                if (exit.target === targetId) {
                    return exit.direction;
                }
            }
        }
    }

    getDirections(): string[] {
        return this.value.map(exit => exit.direction);
    }

    getTargets(): Entity[] {
        return this.value.map(exit => exit.target);
    }
}

export interface Exit {
    direction: string;
    target: Entity;
}
