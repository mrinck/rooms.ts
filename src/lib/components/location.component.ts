import { EntityManager } from "../../core/entityManager";
import { Component } from "../../core/component";

export class LocationComponent extends Component {
    value: string;

    constructor(entity: string, value: string) {
        super(entity, value);
    }

    getChildren(entityManager: EntityManager): string[] {
        const children: string[] = [];
        for (const component of entityManager.getComponentsByClass(LocationComponent)) {
            if (component.value === this.value) {
                children.push(component.entity);
            }
        }
        return children;
    }
}
