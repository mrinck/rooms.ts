import { ExitsComponent } from "../components/exits.component";
import { ComponentManager } from "../../core/componentManager";
import { Entity } from "../../core/api";

export class ExitsUtil {

    static getExitsComponentTargetForDirection(exitsComponent?: ExitsComponent, direction?: string): Entity | undefined {
        if (exitsComponent && direction) {
            for (const exit of exitsComponent.value) {
                if (exit.direction === direction) {
                    return exit.target;
                }
            }
        }
    }

    static getExitsComponentDirectionForTarget(exitsComponent?: ExitsComponent, target?: Entity): string | undefined {
        if (exitsComponent && target) {
            for (const exit of exitsComponent.value) {
                if (exit.target === target) {
                    return exit.direction;
                }
            }
        }
    }

    static getExitsComponentDirections(exitsComponent: ExitsComponent): string[] {
        return exitsComponent.value.map(exit => exit.direction);
    }

    static getExitsComponentTargets(exitsComponent: ExitsComponent): Entity[] {
        return exitsComponent.value.map(exit => exit.target);
    }

}