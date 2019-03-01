import { injectable } from "inversify";
import { Entity } from "../../core/entity";
import { World } from "../../core/world";
import { MoveIntent } from "../intents/move.intent";
import { Room } from "../entities/room";
import { LookCommand } from "../commands/look";
import { Player } from "../../core/player";
import { MoveEvent } from "../events/move.event";

@injectable()
export class MoveAction {

    constructor(
        private world: World
    ) { }

    execute(subject: Entity, direction: string) {
        console.log("executing move action");

        const location = this.world.getEntity(subject.locationId);
        if (location && location instanceof Room) {

            const moveIntent = new MoveIntent(subject, direction);

            location.onIntent(moveIntent);
            subject.onIntent(moveIntent);

            if (!moveIntent.prevented) {
                const moveEvent = new MoveEvent(subject, direction);

                location.onEvent(moveEvent);
                subject.onEvent(moveEvent);
            } else {
                console.log(moveIntent.preventionCause);
            }

        }
    }
}