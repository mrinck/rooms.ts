import { injectable } from "inversify";
import { EventManager } from "../../core/eventManager";
import { LookEvent } from "../events/look.event";
import { OnInit } from "../../core/api";
import { filter } from "rxjs/operators";
import { ComponentManager } from "../../core/componentManager";
import { LocationComponent } from "../../core/components/location.component";
import { DescriptionComponent } from "../components/description.component";
import { LocationUtil } from "../util/location.util";
import { NameComponent } from "../components/name.component";
import { ExitsUtil } from "../util/exits.util";
import { MessageEvent } from "../../core/events/message.event";
import { ExitsComponent } from "../components/exits.component";

@injectable()
export class LookRenderer implements OnInit {

    constructor(
        private eventManager: EventManager,
        private componentManager: ComponentManager
    ) { }

    onInit() {
        this.eventManager.message.pipe(filter(event => event instanceof LookEvent)).subscribe(event => this.render(event));
    }

    render(event: LookEvent) {
        const output: string[] = [];
        const actor = event.actor;

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

        this.eventManager.send(new MessageEvent(event.actor, output.join('')));
    }
}

