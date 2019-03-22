import { Component, component } from "../../core/component";
import { Entity } from "../../core/api";

@component()
export class ExitsComponent extends Component {
    constructor(
        public entity: Entity,
        public value: {
            direction: string;
            target: Entity;
        }[]
    ) {
        super();
    }

    static getTargetForDirection(exitsComponent?: ExitsComponent, direction?: string): Entity | undefined {
        if (exitsComponent && direction) {
            for (const exit of exitsComponent.value) {
                if (exit.direction === direction) {
                    return exit.target;
                }
            }
        }
    }

    static getDirectionForTarget(exitsComponent?: ExitsComponent, target?: Entity): string | undefined {
        if (exitsComponent && target) {
            for (const exit of exitsComponent.value) {
                if (exit.target === target) {
                    return exit.direction;
                }
            }
        }
    }

    static getDirections(exitsComponent: ExitsComponent): string[] {
        return exitsComponent.value.map(exit => exit.direction);
    }

    static getTargets(exitsComponent: ExitsComponent): Entity[] {
        return exitsComponent.value.map(exit => exit.target);
    }
}