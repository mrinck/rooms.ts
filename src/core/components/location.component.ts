import { component, Component } from "../component";
import { Entity } from "../api";
import { ComponentManager } from "../componentManager";

@component()
export class LocationComponent extends Component {
    constructor(
        public entity: Entity,
        public value: string
    ) {
        super();
    }

    static getChildren(entity: Entity, componentManager: ComponentManager): Entity[] {
        const children: string[] = [];
        for (const component of componentManager.getAllComponentsOfType(LocationComponent)) {
            if (component.value === entity) {
                children.push(component.entity);
            }
        }
        return children;
    }
}
