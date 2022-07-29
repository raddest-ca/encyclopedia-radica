import { KnownType } from "./known-types";

export interface Thing<T extends KnownType> {
	type: T;
	id: string;
}

export interface Relationship<L extends KnownType, T extends KnownType, R extends KnownType> {
	type: T;
	left: Thing<L>;
	right: Thing<R>;
}

export type Either = Thing<KnownType> | Relationship<KnownType, KnownType, KnownType>;
export type EitherConsumer = (x: Either) => void;

export function isThing(obj: any): obj is Thing<any> {
	return obj.type !== undefined && obj.id !== undefined;
}
export function isRelationship(obj: any): obj is Relationship<any, any, any> {
	return obj.type !== undefined && obj.left !== undefined && obj.right !== undefined;
}

// export function filterRels<L extends KnownType, T extends KnownType, R extends KnownType>(
// 	rels: Relationship<any, any, any>[],
// 	leftType: L,
// 	type: T,
// 	rightType: R
// ) {}
