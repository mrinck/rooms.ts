import { injectable } from "inversify";
import { Initializable } from "../api";
import { of, Observable } from "rxjs";
import { Entity, EntityClass, EntityDatum } from "../entity";

@injectable()
export class World implements Initializable {
    entities: Entity[];
    entityClasses: EntityClass[];

    private _config: WorldConfig;
    
    get config() {
        return this._config;
    }

    init(config: WorldConfig): Observable<boolean> {
        this._config = {
            file: config.file,
            entityClasses: config.entityClasses || []
        };

        this.entities = [];
        this.entityClasses = this.config.entityClasses!;

        this.load(require(this.config.file));

        return of(true);
    }

    load(entityData: EntityDatum[]) {
        for (const entityDatum of entityData) {
            this.loadEntity(entityDatum);
        }
    }

    loadEntity(entityDatum: EntityDatum) {
        const type = entityDatum.type;
        const entityClass = this.entityClasses.find(entityClass => entityClass.name == type);
        
        if (entityClass) {
            const entity = new entityClass(entityDatum);
            this.addEntity(entity);
        }
    }

    addEntity(entity: Entity) {
        console.log("[World] adding entity", entity.type, entity.id);
        this.entities.push(entity);
    }

    findEntityById(id: string): Entity | undefined {
        const result = this.entities.filter(entitie => entitie.id === id);
        if (result) {
            return result[0];
        }
    }

    /**
     * Generate a 16 digit base62 id.
     */
    private generateId(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id = [];
        for (let i = 0; i < 16; i++) {
            const value = Math.floor(Math.random() * 62);
            id.push(chars[value]);
        }
        return id.join("");
    }
}

export interface WorldConfig {
    file: string;
    entityClasses?: EntityClass[];
}