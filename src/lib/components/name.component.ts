import { Component } from "../../core/component";

export class NameComponent extends Component {
    value: string;

    constructor(entity: string, value: string) {
        super(entity, value);
    }
}
