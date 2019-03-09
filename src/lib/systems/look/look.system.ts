import { injectable } from "inversify";
import { EntityManager } from "../../../core/entityManager";
import { LookAction } from "./look.action";
import { EventManager } from "../../../core/eventManager";
import { Message } from "../../../core/message";
import { LocationComponent } from "../../components/location.component";
import { DescriptionComponent } from "../../components/description.component";
import { NameComponent } from "../../components/name.component";
import { ExitsComponent } from "../../components/exits.component";
import { filter } from "rxjs/operators";
import { OnInit } from "../../../core/api";

@injectable()
export class LookSystem implements OnInit {

    constructor(
        private entityManager: EntityManager,
        private eventManager: EventManager
    ) { }

    onInit() {
        this.eventManager.message.pipe(filter(message => message instanceof LookAction)).subscribe(message => {
            this.onLookAction(message as LookAction);
        });
    }

    onLookAction(action: LookAction) {
        const output: string[] = [];
        const actor = action.actor;

        const actorLocationComponent = this.entityManager.getComponent(actor, LocationComponent);

        if (actorLocationComponent) {
            const actorLocation = actorLocationComponent.value;

            const actorLocationDescriptionComponent = this.entityManager.getComponent(actorLocation, DescriptionComponent);

            if (actorLocationDescriptionComponent) {
                const actorLocationDescription = actorLocationDescriptionComponent.value;
                output.push(actorLocationDescription + "\n");
            }

            const actorLocationChildren = actorLocationComponent.getChildren(this.entityManager);

            for (const content of actorLocationChildren) {
                if (content != actor) {
                    const contentNameComponent = this.entityManager.getComponent(content, NameComponent);
                    if (contentNameComponent) {
                        output.push(contentNameComponent.value + " is here. \n");
                    }
                }
            }

            const actorLocationExitsComponent = this.entityManager.getComponent(actorLocation, ExitsComponent);

            if (actorLocationExitsComponent) {
                output.push("Exits: " + actorLocationExitsComponent.getExitDirections().join(', ') + "\n");
            }
        } else {
            output.push("Whiteness");
        }

        this.eventManager.send(new Message(action.actor, output.join('')));
    }

}