import type { Relationship, Thing, Type } from "./core";
import type { Transformer } from "./transformer";

export class Store {
	private all: Array<Thing | Relationship> = [];
	private transformers: Record<string, Transformer> = {};

	public add(x: Thing | Relationship) {
		this.all.push(x);
		return x;
	}

	public addTransformer(x: Transformer) {
		this.transformers[x.id] = x;
		return x;
	}

	public get(t: Type): Array<Thing | Relationship> {
		// search all
		// find all transformer outputs
		return [];
	}
}
