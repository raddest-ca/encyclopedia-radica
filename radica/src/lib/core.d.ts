type Atom = string;

interface Type {
	id: Atom;
	version: Atom;
}
function isType(obj: any): obj is Type {
	return obj.id !== undefined && obj.version !== undefined;
}

interface Thing {
	type: Type;
	id: Atom;
}
function isThing(obj: any): obj is Thing {
	return obj.type !== undefined && obj.id !== undefined;
}

interface Relationship {
	version: Atom;
	nature: Type;
	left: Thing;
	right: Thing;
}
function isRelationship(obj: any): obj is Relationship {
	return (
		obj.version !== undefined &&
		obj.nature !== undefined &&
		obj.left !== undefined &&
		obj.right !== undefined
	);
}

type Either = Thing | Relationship;

class Transformer {
	id: string;
	predicate: (x: Either) => boolean;
	transform: (x: Either) => Either;
}
