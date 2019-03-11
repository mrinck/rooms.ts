import { Component, component } from "../../core/component";

@component()
export class LocationComponent extends Component {
    value: string;

    constructor(entity: string, value: string) {
        super(entity, value);
    }

}
