import { component, Component } from "../../core/component";
import { Entity } from "../../core/api";

@component()
export class LocationComponent extends Component {

    constructor(
        public entity: Entity,
        public value: string
    ) {
        super();
    }
}
