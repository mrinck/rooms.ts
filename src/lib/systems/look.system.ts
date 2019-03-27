import { LookAction, OnLookAction } from "../actions/look.action";
import { EventManager } from "../../core/eventManager";
import { system } from "../../core/system";
import { ComponentManager } from "../../core/componentManager";
import { LocationComponent } from "../../core/components/location.component";
import { DescriptionComponent } from "../components/description.component";
import { NameComponent } from "../components/name.component";
import { ExitsComponent } from "../components/exits.component";
import { MessageEvent } from "../../core/events/message.event";
import { OnExamineAction, ExamineAction } from "../actions/examine.action";

@system()
export class LookSystem implements OnLookAction, OnExamineAction {

    constructor(
        private eventManager: EventManager,
        private componentManager: ComponentManager
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
            } else {
                output.push("Inside @" + actorLocation + "\n");
            }

            const actorLocationChildren = LocationComponent.getChildren(actorLocation, this.componentManager);

            for (const content of actorLocationChildren) {
                if (content !== actor) {
                    const contentNameComponent = this.componentManager.getComponent(content, NameComponent);
                    if (contentNameComponent) {
                        output.push(contentNameComponent.value + " is here. \n");
                    }
                }
            }

            const actorLocationExitsComponent = this.componentManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                output.push("Exits: " + ExitsComponent.getDirections(actorLocationExitsComponent).join(', ') + "\n");
            }
        } else {
            output.push("Whiteness");
        }

        this.eventManager.send(new MessageEvent(action.actor, output.join('')));
    }

    onExamineAction(action: ExamineAction) {
        console.log("EXAMINING", action.target);
    }
}