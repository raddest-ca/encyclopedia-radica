import type { Relationship, Thing } from "./core";
import type { LoadEvent } from "@sveltejs/kit";
import type { KnownType } from "./known-types";
import type { RelationshipQuery, ThingQuery } from "./common/querying";
import type { InsertPayload } from "./common/inserting";
import { backends } from "./backends";

export type FetchFunc = typeof fetch | LoadEvent["fetch"];

export type ThingResults = Awaited<ReturnType<typeof getThings>>;

export async function invoke(fetch: FetchFunc, route: string, body: any) {
	for (const backend of backends) {
		
	}
}

// export async function insert(fetch: FetchFunc, body: InsertPayload) {
// 	console.log("Inserting with payload", body);
// 	try {
// 		const req = await fetch(`${backend}/insert`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(body),
// 		});
// 		return await req.json();
// 	} catch (e) {
// 		console.error("Inserting failed", e);
// 		// todo: toast with error
// 		// todo: standardize error responses from server
// 		return null;
// 	}
// }

export async function getThings<T extends KnownType>(
	fetch: FetchFunc,
	body: ThingQuery<T>,
) {
	console.log("Requesting things with body", body);
	const req = await fetch(`${backend}/query/things`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as Thing<T>[];
}

export async function countThings<T extends KnownType>(
	fetch: FetchFunc,
	body: ThingQuery<T>,
) {
	console.log("Requesting things with body", body);
	const req = await fetch(`${backend}/query/countThings`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as number;
}

export async function getCollatedThings<T extends KnownType>(
	fetch: FetchFunc,
	bodies: ThingQuery<T>[],
): Promise<Thing<T>[]> {
	const res = await Promise.all(bodies.map((b) => getThings(fetch, b)));
	return res.flatMap(x => x);
}

export async function getRelationships<
	L extends KnownType,
	T extends KnownType,
	R extends KnownType,
>(fetch: FetchFunc, body: RelationshipQuery<L, T, R>) {
	console.log("Requesting relationships with query", body);
	const req = await fetch(`${backend}/query/relationships`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as Relationship<L, T, R>[];
}

export async function countRelationships<
	L extends KnownType,
	T extends KnownType,
	R extends KnownType,
>(fetch: FetchFunc, body: RelationshipQuery<L, T, R>) {
	console.log("Requesting relationships with query", body);
	const req = await fetch(`${backend}/query/countRelationships`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as number;
}

export async function getCollatedRelationships<
	L extends KnownType,
	T extends KnownType,
	R extends KnownType,
>(
	fetch: FetchFunc,
	bodies: RelationshipQuery<L, T, R>[],
): Promise<Relationship<L, T, R>[]> {
	const res = await Promise.all(bodies.map((b) => getRelationships(fetch, b)));
	return res.flatMap(x => x);
}

export type RelationshipResults = Awaited<ReturnType<typeof getRelationships>>;
