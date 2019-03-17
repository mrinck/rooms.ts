import { Entity } from "../../core/api";
import { ComponentManager } from "../../core/componentManager";
import { LocationComponent } from "../../core/components/location.component";

export class LocationUtil {

    static getLocationChildren(entity: Entity, componentManager: ComponentManager): Entity[] {
        const children: string[] = [];
        for (const component of componentManager.getAllComponentsOfType(LocationComponent)) {
            if (component.value === entity) {
                children.push(component.entity);
            }
        }
        return children;
    }

}