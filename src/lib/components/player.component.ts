import { Component } from "../../core/component";

export class PlayerComponent extends Component {
    value: string;

    constructor(entity: string, value: string) {
        super(entity, value);
    }
}
