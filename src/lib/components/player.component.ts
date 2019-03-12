import { component, Component } from "../../core/component";
import { Entity } from "../../core/api";

@component()
export class PlayerComponent extends Component {
    constructor(
        public entity: Entity,
        public value: string
    ) {
        super();
    }
}
