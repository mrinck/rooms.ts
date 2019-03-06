import { World } from "../../core/world";
import { Component } from "../../core/component";

export class LocationComponent extends Component {
    value: string;

    constructor(entity: string, value: string) {
        super(entity, value);
    }

    getChildren(world: World): string[] {
        const children: string[] = [];
        for (const component of world.getComponentsByClass(LocationComponent)) {
            if (component.value === this.value) {
                children.push(component.entity);
            }
        }
        return children;
    }
}
