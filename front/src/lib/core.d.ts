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
	type: Type;
	left: Thing;
	right: Thing;
}

export type Either = Thing | Relationship;
export type EitherConsumer = (x: Either) => void;

