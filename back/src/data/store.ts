import { Either, isRelationship, isThing, Relationship, Thing } from "../common/core";
import type { DeepPartial } from "tsdef";
import { KnownType } from "../models/known-types";

export interface ThingQuery<T extends KnownType> {
	filter: {
		id?: string;
		type?: T;
	};
	countOnly?: boolean;
}

export interface RelationshipQuery<L extends KnownType, T extends KnownType, R extends KnownType> {
	filter: {
		type?: T;
		left?: {
			id?: string;
			type?: L;
		};
		right?: {
			id?: string;
			type?: R;
		};
	};
	countOnly?: boolean;
}

export interface CollectionResult<T> {
	values: T[];
	count: number;
	countOnly: boolean;
	success: boolean;
}

export class Store {
	private things: Array<Thing<KnownType>> = [];
	private relationships: Array<Relationship<KnownType, KnownType, KnownType>> = [];

	public async add(x: Either) {
		// prevent adding duplicates
		if (isThing(x) && (await this.getThings({ filter: x, countOnly: true })).count === 0)
			this.things.push(x);
		if (
			isRelationship(x) &&
			(await this.getRelationships({ filter: x, countOnly: true })).count === 0
		)
			this.relationships.push(x);
		return x;
	}

	public async addAll(...items: Either[]) {
		return await Promise.all(items.map(x => this.add(x)));
	}

	public async getThings<T extends KnownType>(query: ThingQuery<T>): Promise<CollectionResult<Thing<T>>> {
		// console.dir(query);
		let pred: (t: Thing<KnownType>) => boolean = _ => true;
		if (query.filter.type !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type === query.filter.type;
		}
		if (query.filter.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.id === query.filter.id;
		}
		const rtn = this.things.filter(pred) as Thing<T>[];
		return {
			values: query.countOnly ? [] : rtn,
			count: rtn.length,
			countOnly: query.countOnly ?? false,
			success: true,
		};
	}

	public async getRelationships<L extends KnownType, T extends KnownType, R extends KnownType>(
		query: RelationshipQuery<L, T, R>,
	): Promise<CollectionResult<Relationship<L, T, R>>> {
		// console.dir(query);
		let pred: (x: Relationship<KnownType, KnownType, KnownType>) => boolean = _ => true;
		if (query.filter.type !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type === query.filter.type;
		}
		if (query.filter.left?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.id === query.filter.left?.id;
		}
		if (query.filter.left?.type !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type === query.filter.left?.type;
		}
		if (query.filter.right?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.id === query.filter.right?.id;
		}
		if (query.filter.right?.type !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type === query.filter.right?.type;
		}
		const rtn = this.relationships.filter(pred) as Relationship<L, T, R>[];
		return {
			values: query.countOnly ? [] : rtn,
			count: rtn.length,
			countOnly: query.countOnly ?? false,
			success: true,
		};
	}
}
