import type { Relationship, Thing } from "./core";
import type { DeepPartial } from "tsdef";
export interface ThingQuery {
	filter: DeepPartial<Thing>;
	countOnly?: boolean;
}
export interface RelationshipQuery {
	filter: DeepPartial<Relationship>;
	countOnly?: boolean;
}

export async function getThings(body: ThingQuery) {
	console.log("Requesting things with body", body);
	const req = await fetch("http://localhost:8080/things", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as {
		values?: Thing[];
		count: number;
	};
}
export type ThingResults = Awaited<ReturnType<typeof getThings>>;

export async function getRelationships(body: RelationshipQuery) {
	console.log("Requesting relationships with query", body);
	const req = await fetch("http://localhost:8080/rels", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as {
		values?: Relationship[];
		count: number;
	};
}

export async function getCollatedRelationships(bodies: RelationshipQuery[]) {
	const res = await Promise.all(bodies.map((b) => getRelationships(b)));
	return res.reduce(
		(acc, v) => {
			acc.values?.push(...(v.values ?? []));
			acc.count += v.values?.length ?? 0;
			return acc;
		},
		{
			values: [],
			count: 0,
		},
	);
}

export type RelationshipResults = Awaited<ReturnType<typeof getRelationships>>;
