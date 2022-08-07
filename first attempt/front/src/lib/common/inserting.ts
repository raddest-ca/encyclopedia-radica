import type { Relationship, Thing } from "./core";
import type { KnownType } from "./known-types";

export type InsertableThing = Thing<KnownType> | {
	idRef: string;
	type: KnownType;
}; 
export type InsertableRelationship = Relationship<KnownType,KnownType,KnownType> | {
	type: KnownType;
	left: InsertableThing;
	right: InsertableThing;
};

export interface InsertPayload {
	things?: InsertableThing[];
	relationships?: InsertableRelationship[];
}
