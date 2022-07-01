export type Atom = string;

export interface Type {
	id: Atom;
	version: Atom;
}

export interface Thing {
	type: Type;
	id: Atom;
}

export interface Relationship {
	version: Atom;
	nature: Type;
	left: Thing;
	right: Thing;
}

export type Either = Thing | Relationship;
export type EitherConsumer = (x: Either) => void;

export interface ThingQuery {
	type: Type;
}

export interface RelationshipQuery {
	left?: Thing;
	leftType?: Type;
	right?: Thing;
	rightType?: Type;
	type?: Type;
}
