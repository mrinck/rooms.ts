import { OnDigAction, DigAction } from "../actions/dig.action";
import { system } from "../../core/system";
import { ComponentManager } from "../../core/componentManager";
import { LocationComponent } from "../../core/components/location.component";
import { ExitsComponent } from "../components/exits.component";
import { SystemManager } from "../../core/systemManager";
import { MoveAction } from "../actions/move.action";

@system()
export class CreationSystem implements OnDigAction {

    constructor(private componentManager: ComponentManager, private systemManager: SystemManager) { }

    onDigAction(action: DigAction) {
        const actor = action.actor;
        const direction = action.direction;

        const actorLocationComponent = this.componentManager.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;

            const actorLocationExitsComponent = this.componentManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                if(!ExitsComponent.getDirections(actorLocationExitsComponent).includes(direction)) {
                    const newLocation = this.componentManager.createEntity();
                    actorLocationExitsComponent.value.push({
                        direction: direction,
                        target: newLocation
                    });
                    this.componentManager.addComponent(new ExitsComponent(newLocation, [{
                        direction: ExitsComponent.getOppositeDirection(direction) || "to_" + actorLocation ,
                        target: actorLocation
                    }]));
                    this.systemManager.execute(new MoveAction(actor, direction));
                }
            }
        }
    }
}