import { Component } from "../../core/component";

export class NameComponent extends Component {
    entity: string;
    value: string;

    constructor(entity: string, value: string) {
        super();
        this.entity = entity;
        this.value = value;
    }
}


export class NameComponentData {
    entity: string;
    value: string;
}