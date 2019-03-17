import { component, Component } from "../component";
import { Entity } from "../api";

@component()
export class LocationComponent extends Component {
    constructor(
        public entity: Entity,
        public value: string
    ) {
        super();
    }
}
