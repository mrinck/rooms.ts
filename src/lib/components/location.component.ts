export class LocationComponent {
    entityId: string;
    value: string;

    constructor(entityId: string, value: string) {
        this.entityId = entityId;
        this.value = value;
    }
}


export class LocationComponentData {
    entityId: string;
    value: string;
}