import { ComponentManager } from "../../core/componentManager";
import { LookAction } from "../actions/look.action";
import { EventManager } from "../../core/eventManager";
import { Message } from "../../core/message";
import { LocationComponent } from "../components/location.component";
import { DescriptionComponent } from "../components/description.component";
import { NameComponent } from "../components/name.component";
import { ExitsComponent } from "../components/exits.component";
import { LocationUtil } from "../util/location.util";
import { ExitsUtil } from "../util/exits.util";
import { system } from "../../core/system";

@system()
export class LookSystem {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager
    ) { }

    onLookAction(action: LookAction) {
        const output: string[] = [];
        const actor = action.actor;

        const actorLocationComponent = this.componentManager.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;

            const actorLocationDescriptionComponent = this.componentManager.getComponent(actorLocation, DescriptionComponent);

            if (actorLocationDescriptionComponent) {
                const actorLocationDescription = actorLocationDescriptionComponent.value;
                output.push(actorLocationDescription + "\n");
            }

            const actorLocationChildren = LocationUtil.getLocationChildren(actorLocation, this.componentManager);

            for (const content of actorLocationChildren) {
                if (content != actor) {
                    const contentNameComponent = this.componentManager.getComponent(content, NameComponent);
                    if (contentNameComponent) {
                        output.push(contentNameComponent.value + " is here. \n");
                    }
                }
            }

            const actorLocationExitsComponent = this.componentManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                output.push("Exits: " + ExitsUtil.getExitsComponentDirections(actorLocationExitsComponent).join(', ') + "\n");
            }
        } else {
            output.push("Whiteness");
        }

        this.eventManager.send(new Message(action.actor, output.join('')));
    }

}