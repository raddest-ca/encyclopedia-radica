import { Either, isRelationship, isThing, Relationship, Thing } from "../models/core";
import type { DeepPartial } from "tsdef";
export interface ThingQuery {
	filter: DeepPartial<Thing>;
	countOnly?: boolean;
}
export interface RelationshipQuery {
	filter: DeepPartial<Relationship>;
	countOnly?: boolean;
}

export class Store {
	public things: Array<Thing> = [];
	public relationships: Array<Relationship> = [];

	public add(x: Either) {
		if (isThing(x)) this.things.push(x);
		if (isRelationship(x)) this.relationships.push(x);
		return x;
	}
}
