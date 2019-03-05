export class DescriptionComponent {
    entityId: string;
    value: string;

    constructor(entityId: string, value: string) {
        this.entityId = entityId;
        this.value = value;
    }
}


export class DescriptionComponentData {
    entityId: string;
    value: string;
}