import { Component, component } from "../../core/component";
import { Entity } from "../../core/api";

@component()
export class ExitsComponent extends Component {
    value: Exit[];

    constructor(entity: string, value: Exit[]) {
        super(entity, value);
    }

}

export interface Exit {
    direction: string;
    target: Entity;
}
