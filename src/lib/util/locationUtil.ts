import { Entity } from "../../core/api";
import { ComponentManager } from "../../core/componentManager";
import { LocationComponent } from "../components/location.component";

export class LocationUtil {

    static getLocationChildren(entity: Entity, componentManager: ComponentManager): Entity[] {
        const children: string[] = [];
        for (const component of componentManager.getComponentsByClass(LocationComponent)) {
            if (component.value === entity) {
                children.push(component.entity);
            }
        }
        return children;
    }

}