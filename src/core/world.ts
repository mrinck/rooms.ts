import { injectable } from "inversify";
import { Initializable, Config } from "./api";
import { of, Observable, Subject } from "rxjs";
import { Entity, EntityClass, EntityDatum, EntityData } from "./entity";
import { Player } from "./player";
import { EntityFactory } from "./entityFactory";

@injectable()
export class World implements Initializable {
    entityData: EntityData;
    entities: Entity[];

    entityAdded: Observable<Entity>;

    private _config: WorldConfig;
    private entityAddedSubject: Subject<Entity>;

    constructor(private entityFactory: EntityFactory) { }

    get config() {
        return this._config;
    }

    init(config: Config): Observable<boolean> {
        this._config = {
            data: config.world && config.world.data || {},
            entityClasses: config.entities
        };

        this.entities = [];
        this.entityAddedSubject = new Subject();
        this.entityAdded = this.entityAddedSubject.asObservable();

        this.load();

        console.log("[World] loaded");

        return of(true);
    }

    private load() {
        const entityData = this.config.data as EntityDatum[];

        for (const entityDatum of entityData) {
            this.loadEntity(entityDatum);
        }
    }

    private loadEntity(entityDatum: EntityDatum) {
        const entity = this.entityFactory.create(entityDatum);

        if (entity) {
            this.addEntity(entity);
        }
    }

    addEntity(entity: Entity) {
        console.log("[World] adding", entity.type, "\"" + entity.name + "\"");

        if (entity instanceof Player) {
            entity.locationId = this.entities[0].id;
        }

        this.entities.push(entity);
        this.entityAddedSubject.next(entity);
    }

    getEntity(id?: string): Entity | undefined {
        if (id) {
            return this.entities.find(entity => entity.id === id);
        }
    }

    getChildren(parent: Entity): Entity[] {
        return this.entities.filter(entity => entity.locationId === parent.id);
    }

    getSiblings(sibling: Entity): Entity[] {
        if (sibling.locationId) {
            return this.entities.filter(entity => entity.locationId === sibling.locationId).filter(entity => entity != sibling);
        }

        return [];
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
    data: {};
    entityClasses?: EntityClass[];
}