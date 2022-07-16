import { Either, isRelationship, isThing, Relationship, Thing } from "../models/core";
import type { DeepPartial } from "tsdef";
import type { Transformer } from "../models/transformer";

export interface ThingQuery {
	filter: DeepPartial<Thing>;
	countOnly?: boolean;
}
export interface RelationshipQuery {
	filter: DeepPartial<Relationship>;
	countOnly?: boolean;
}

export class Store {
	private things: Array<Thing> = [];
	private relationships: Array<Relationship> = [];
	private transformers: Record<string, Transformer> = {};

	public add(x: Either) {
		if (isThing(x)) this.things.push(x);
		if (isRelationship(x)) this.relationships.push(x);
		return x;
	}

	public addTransformer(x: Transformer) {
		this.transformers[x.id] = x;
		return x;
	}

	public getThings(query: ThingQuery) {
		console.dir(query);
		let pred: (t: Thing) => boolean = _ => true;
		if (query.filter.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.id === query.filter.type!.id;
		}
		if (query.filter.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.version === query.filter.type!.version;
		}
		const rtn = this.things.filter(pred);
		return {
			values: query.countOnly === true ? undefined : rtn,
			count: rtn.length,
		};
	}

	public getRelationships(query: RelationshipQuery) {
		console.dir(query);
		let pred: (t: Relationship) => boolean = _ => true;
		if (query.filter.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.id === query.filter.type!.id;
		}
		if (query.filter.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.version === query.filter.type!.version;
		}
		if (query.filter.left?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.id === query.filter.left?.id;
		}
		if (query.filter.left?.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type?.id === query.filter.left?.type?.id;
		}
		if (query.filter.left?.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type?.version === query.filter.left?.type?.version;
		}
		if (query.filter.right?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.id === query.filter.right?.id;
		}
		if (query.filter.right?.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type?.id === query.filter.right?.type?.id;
		}
		if (query.filter.right?.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type?.version === query.filter.right?.type?.version;
		}
		const rtn = this.relationships.filter(pred);
		return {
			values: query.countOnly === true ? undefined : rtn,
			count: rtn.length,
		};
	}
}
