import type { Relationship, RelationshipQuery, Thing, ThingQuery } from "./core";

export async function getThings(body: ThingQuery): Promise<Thing[]> {
	const req = await fetch("http://localhost:8080/things", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			body,
		}),
	});
    return await req.json();
}

export async function getRelationships(body: RelationshipQuery): Promise<Relationship[]> {
	const req = await fetch("http://localhost:8080/rels", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			body,
		}),
	});
    return await req.json();
}
