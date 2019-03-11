import { injectable } from "inversify";
import { ComponentManager } from "../../../core/componentManager";
import { LookAction } from "./look.action";
import { EventManager } from "../../../core/eventManager";
import { Message } from "../../../core/message";
import { LocationComponent } from "../../components/location.component";
import { DescriptionComponent } from "../../components/description.component";
import { NameComponent } from "../../components/name.component";
import { ExitsComponent } from "../../components/exits.component";
import { filter } from "rxjs/operators";
import { OnInit } from "../../../core/api";
import { MoveSystem } from "../move/move.system";
import { system } from "../../../core/system";
import { LocationUtil } from "../../util/locationUtil";
import { ExitsUtil } from "../../util/exitsUtil";

@injectable()
@system()
export class LookSystem implements OnInit {

    constructor(
        private componentManager: ComponentManager,
        private eventManager: EventManager,
        private moveSystem: MoveSystem
    ) { }

    onInit() {
        this.eventManager.message.pipe(filter(message => message instanceof LookAction)).subscribe(message => {
            this.onLookAction(message as LookAction);
        });
    }

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