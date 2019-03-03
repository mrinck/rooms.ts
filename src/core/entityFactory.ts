import { injectable } from "inversify";
import { EntityClass, EntityDatum, Entity } from "./entity";
import { Config } from "./api";
import { Observable, of } from "rxjs";

@injectable()
export class EntityFactory {
    entityClasses: EntityClass[];

    private entityClassMap: { [key: string]: EntityClass }

    async init(config: Config) {
        this.entityClasses = config.entities || [];
        this.entityClassMap = {};

        for (const entityClass of this.entityClasses) {
            this.entityClassMap[entityClass.name] = entityClass;
        }
    }

    create(entityDatum: EntityDatum): Entity | undefined {
        const type = entityDatum.type;
        const entityClass = this.entityClassMap[type];

        if (entityClass) {
            const entity = new entityClass();
            entity.onInit(entityDatum);
            return entity;
        }
    }
}