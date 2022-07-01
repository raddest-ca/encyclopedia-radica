export type Atom = string;

export interface Type {
	id: Atom;
	version: Atom;
}
export function isType(obj: any): obj is Type {
	return obj.id !== undefined && obj.version !== undefined;
}

export interface Thing {
	type: Type;
	id: Atom;
}
export function isThing(obj: any): obj is Thing {
	return obj.type !== undefined && obj.id !== undefined;
}

export interface Relationship {
	version: Atom;
	nature: Type;
	left: Thing;
	right: Thing;
}
export function isRelationship(obj: any): obj is Relationship {
	return (
		obj.version !== undefined &&
		obj.nature !== undefined &&
		obj.left !== undefined &&
		obj.right !== undefined
	);
}

export type Either = Thing | Relationship;
export type EitherConsumer = (x: Either) => void;
