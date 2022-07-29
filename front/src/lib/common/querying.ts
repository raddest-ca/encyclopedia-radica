import { KnownType } from "../models/known-types";
import { Relationship, Thing } from "./core";

export interface ThingQuery<T extends KnownType> {
	filter: {
		id?: string;
		type?: T;
	};
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
}

export function getThings<T extends KnownType>(
	things: Thing<any>[],
	query: ThingQuery<T>,
): Thing<T>[] {
	let pred: (t: Thing<KnownType>) => boolean = _ => true;
	if (query.filter.type !== undefined) {
		const old = pred;
		pred = x => old(x) && x.type === query.filter.type;
	}
	if (query.filter.id !== undefined) {
		const old = pred;
		pred = x => old(x) && x.id === query.filter.id;
	}
	const rtn = things.filter(pred) as Thing<T>[];
	return rtn;
}

export function getRelationships<L extends KnownType, T extends KnownType, R extends KnownType>(
	relationships: Relationship<any, any, any>[],
	query: RelationshipQuery<L, T, R>,
): Relationship<L, T, R>[] {
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
	const rtn = relationships.filter(pred) as Relationship<L, T, R>[];
	return rtn;
}
