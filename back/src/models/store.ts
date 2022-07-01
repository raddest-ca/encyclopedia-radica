import {
	Either,
	isOfType,
	isRelationship,
	isSameThing,
	isThing,
	Relationship,
	Thing,
	Type,
} from "./core";
import type { Transformer } from "./transformer";

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

	public getThings(t: ThingQuery): Array<Thing> {
		return this.things.filter(x => isOfType(x, t.type));
	}

	public getRelationships(query: RelationshipQuery): Array<Relationship> {
		return this.relationships.filter(
			x =>
				(query.type === undefined || isOfType(x, query.type)) &&
				(query.left === undefined || isSameThing(x.left, query.left)) &&
				(query.right === undefined || isSameThing(x.right, query.right)) &&
				(query.leftType === undefined || isOfType(x.left, query.leftType)) &&
				(query.rightType === undefined || isOfType(x.right, query.rightType)),
		);
	}
}
