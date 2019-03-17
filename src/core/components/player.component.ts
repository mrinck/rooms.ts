import { component, Component } from "../component";
import { Entity } from "../api";

@component()
export class PlayerComponent extends Component {
    constructor(
        public entity: Entity,
        public value: string
    ) {
        super();
    }
}
