import { Component } from "../../core/component";

export class DescriptionComponent extends Component {
    entity: string;
    value: string;

    constructor(entity: string, value: string) {
        super();
        this.entity = entity;
        this.value = value;
    }
}


export class DescriptionComponentData {
    entity: string;
    value: string;
}