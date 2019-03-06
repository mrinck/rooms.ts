export abstract class Component {
    type: string;
    entity: string;
    value: any;

    constructor(entity: string, value: any) {
        this.type = this.constructor.name;
        this.entity = entity;
        this.value = value;
    }

    toJSON(): ComponentData {
        return {
            type: this.type,
            entity: this.entity,
            value: this.value
        }
    }
}

export interface ComponentData {
    type: string;
    entity: any;
    value: any;
}

export interface ComponentType<T extends Component> { new(...args: any[]): T }

export interface ComponentClass {
    new(...params: any[]): Component;
}