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

export type Either = Thing | Relationship;
export type EitherConsumer = (x: Either) => void;
