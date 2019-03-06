import { World } from "../../core/world";
import { Component } from "../../core/component";

export class LocationComponent extends Component {
    entity: string;
    value: string;

    constructor(entity: string, value: string) {
        super();
        this.entity = entity;
        this.value = value;
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


export class LocationComponentData {
    entity: string;
    value: string;
}