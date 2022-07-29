import { Either, isRelationship, isThing, Relationship, Thing } from "../common/core";
import type { DeepPartial } from "tsdef";
import { KnownType } from "../common/known-types";
import { createLogger } from "bunyan";
import { config } from "../config";
import { getRelationships, getThings, RelationshipQuery, ThingQuery } from "../common/querying";

export class Store {
	private things: Array<Thing<KnownType>> = [];
	private relationships: Array<Relationship<KnownType, KnownType, KnownType>> = [];
	private logger;

	constructor() {
		this.logger = createLogger({ name: "store", level: config.log_level });
	}

	public async add(x: Either) {
		// prevent adding duplicates
		if (isThing(x) && (await this.countThings({ filter: x })) === 0) {
			this.logger.debug({ thing: x }, "adding thing");
			this.things.push(x);
		}
		if (isRelationship(x) && (await this.countRelationships({ filter: x })) === 0) {
			this.logger.debug({ relationship: x }, "adding relationship");
			this.relationships.push(x);
		}
		return x;
	}

	public async addAll(...items: Either[]) {
		return await Promise.all(items.map(x => this.add(x)));
	}

	public async getThings<T extends KnownType>(query: ThingQuery<T>): Promise<Thing<T>[]> {
		return getThings(this.things, query);
	}

	public async countThings<T extends KnownType>(query: ThingQuery<T>): Promise<number> {
		return getThings(this.things, query).length;
	}

	public async getRelationships<L extends KnownType, T extends KnownType, R extends KnownType>(
		query: RelationshipQuery<L, T, R>,
	): Promise<Relationship<L, T, R>[]> {
		return getRelationships(this.relationships, query);
	}
	public async countRelationships<L extends KnownType, T extends KnownType, R extends KnownType>(
		query: RelationshipQuery<L, T, R>,
	): Promise<number> {
		return getRelationships(this.relationships, query).length;
	}
}
