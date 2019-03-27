import { component, Component } from "../../core/component";
import { Entity } from "../../core/api";

@component()
export class DetailsComponent extends Component {
    constructor(
        public entity: Entity,
        public value: DetailDescription[]
    ) {
        super();
    }
}

export interface DetailDescription {
    name: string;
    aliases: string[];
    description: string;
}
