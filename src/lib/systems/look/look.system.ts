import { injectable } from "inversify";
import { World } from "../../../core/world";
import { LookAction } from "./look.action";
import { Dispatcher } from "../../../core/dispatcher";
import { Message } from "../../../core/message";
import { LocationComponent } from "../../components/location.component";
import { DescriptionComponent } from "../../components/description.component";
import { NameComponent } from "../../components/name.component";
import { ExitsComponent } from "../../components/exits.component";

@injectable()
export class LookSystem {

    constructor(
        private world: World,
        private dispatcher: Dispatcher
    ) { }

    onLookAction(action: LookAction) {
        const output: string[] = [];
        const actor = action.actor;

        const actorLocationComponent = this.world.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;

            const actorLocationDescriptionComponent = this.world.getComponent(actorLocation, DescriptionComponent);

            if (actorLocationDescriptionComponent) {
                const actorLocationDescription = actorLocationDescriptionComponent.value;
                output.push(actorLocationDescription + "\n");
            }

            const actorLocationChildren = actorLocationComponent.getChildren(this.world);

            for (const content of actorLocationChildren) {
                if (content != actor) {
                    const contentNameComponent = this.world.getComponent(content, NameComponent);
                    if (contentNameComponent) {
                        output.push(contentNameComponent.value + " is here. \n");
                    }
                }
            }

            const actorLocationExitsComponent = this.world.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                output.push("Exits: " + actorLocationExitsComponent.getExitDirections().join(', ') + "\n");
            }
        } else {
            output.push("Whiteness");
        }

        this.dispatcher.dispatch(new Message(action.actor, output.join('')));
    }

}