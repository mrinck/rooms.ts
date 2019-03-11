import { Component } from "../../core/component";
import { ComponentManager } from "../../core/componentManager";
import { Entity } from "../../core/api";

export class LocationComponent extends Component {
    value: string;

    constructor(entity: string, value: string) {
        super(entity, value);
    }

}
