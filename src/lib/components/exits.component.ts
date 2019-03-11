import { Component, component } from "../../core/component";
import { Entity } from "../../core/api";

@component()
export class ExitsComponent extends Component {

    constructor(
        public entity: Entity,
        public value: {
            direction: string;
            target: Entity;
        }[]
    ) {
        super();
    }

}