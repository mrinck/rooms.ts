import { injectable } from "inversify";
import { World } from "../../../core/world";
import { LookAction } from "./look.action";
import { Dispatcher } from "../../../core/dispatcher";
import { Message } from "../../../core/message";
import { LocationComponent } from "../../components/location.component";
import { DescriptionComponent } from "../../components/description.component";

@injectable()
export class LookHandler {

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

            
        }



        // if (playerLocation) {

        //     // output contents
        //     const locationContents = this.world.getChildren(playerLocation);
        //     if (locationContents.length > 1) {
        //         for (const content of locationContents) {
        //             if (content != action.subject) {
        //                 output.push(content.name! + " is here. \n");
        //             }
        //         }
        //     }

        //     // output exits
        //     if (playerLocation instanceof Room) {
        //         output.push("Exits: " + playerLocation.getExitDirections().join(', ') + "\n");
        //     }
        // } else {
        //     output.push('Whiteness');
        // }

        this.dispatcher.dispatch(new Message(action.actor, output.join('')));
    }

}