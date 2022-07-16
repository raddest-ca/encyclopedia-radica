import { Either, isRelationship, isThing, Relationship, Thing } from "../models/core";
import type { DeepPartial } from "tsdef";
import type { Transformer } from "../models/transformer";

export type ThingQuery = DeepPartial<Thing>;
export type RelationshipQuery = DeepPartial<Relationship>;

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

	public getThings(query: ThingQuery): Array<Thing> {
		let pred: (t: Thing) => boolean = _ => true;
		if (query.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.id === query.type!.id;
		}
		if (query.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.version === query.type!.version;
		}
		return this.things.filter(pred);
	}

	public getRelationships(query: RelationshipQuery): Array<Relationship> {
		let pred: (t: Relationship) => boolean = _ => true;
		if (query.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.id === query.type!.id;
		}
		if (query.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.type.version === query.type!.version;
		}
		if (query.left?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.id === query.left?.id;
		}
		if (query.left?.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type?.id === query.left?.type?.id;
		}
		if (query.left?.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.left.type?.version === query.left?.type?.version;
		}
		if (query.right?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.id === query.right?.id;
		}
		if (query.right?.type?.id !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type?.id === query.right?.type?.id;
		}
		if (query.right?.type?.version !== undefined) {
			const old = pred;
			pred = x => old(x) && x.right.type?.version === query.right?.type?.version;
		}
		return this.relationships.filter(pred);
	}
}
