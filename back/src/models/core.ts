export interface Type {
	id: string;
	version: string;
}
export function isType(obj: any): obj is Type {
	return obj.id !== undefined && obj.version !== undefined;
}

export interface Thing {
	type: Type;
	id: string;
}
export function isThing(obj: any): obj is Thing {
	return obj.type !== undefined && obj.id !== undefined;
}

export interface Relationship {
	type: Type;
	left: Thing;
	right: Thing;
}
export function isRelationship(obj: any): obj is Relationship {
	return (
		obj.type !== undefined &&
		obj.left !== undefined &&
		obj.right !== undefined
	);
}

export function isOfType(obj: Either, t: Type) {
	return obj.type.id === t.id && obj.type.version === t.version
}

export function isSameThing(left: Thing, right: Thing) {
	return left.id === right.id && isOfType(left, right.type);
}

export type Either = Thing | Relationship;
export type EitherConsumer = (x: Either) => void;
