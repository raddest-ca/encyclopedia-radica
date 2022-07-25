import type { Relationship, Thing } from "./core";
import type { LoadEvent } from "@sveltejs/kit";
import type { KnownType } from "./known-types";


// export const backend = "https://localhost";
export const backend = "http://localhost";

export interface ThingQuery<T extends KnownType> {
	filter: {
		id?: string;
		type?: T;
	};
	countOnly?: boolean;
}

export interface RelationshipQuery<L extends KnownType, T extends KnownType, R extends KnownType> {
	filter: {
		type?: T;
		left?: {
			id?: string;
			type?: L;
		};
		right?: {
			id?: string;
			type?: R;
		};
	};
	countOnly?: boolean;
}

export interface CollectionResult<T> {
	values: T[];
	count: number;
	countOnly: boolean;
	success: boolean;
}

export type FetchFunc = typeof fetch | LoadEvent["fetch"];

export type ThingResults = Awaited<ReturnType<typeof getThings>>;

export async function getThings<T extends KnownType>(fetch: FetchFunc, body: ThingQuery<T>): Promise<CollectionResult<Thing<T>>> {
	console.log("Requesting things with body", body);
	try {
		const req = await fetch(`${backend}/things`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(body),
		});
		return await req.json();
	} catch (e) {
		console.error("Fetching things failed", e);
		return {
			values: [],
			count: 0,
			countOnly: true,
			success: false
		}
	}
}

export async function getCollatedThings<T extends KnownType>(fetch: FetchFunc, bodies: ThingQuery<T>[]): Promise<CollectionResult<Thing<T>>> {
	const res = await Promise.all(bodies.map((b) => getThings(fetch, b)));
	return res.reduce(
		(acc, v) => {
			acc.values?.push(...(v.values ?? []));
			acc.count += v.values?.length ?? 0;
			return acc;
		},
		{
			values: [],
			count: 0,
			countOnly: false,
			success: true,
		},
	);
}

export async function getRelationships<L extends KnownType, T extends KnownType, R extends KnownType>(fetch: FetchFunc, body: RelationshipQuery<L,T,R>) {
	console.log("Requesting relationships with query", body);
	const req = await fetch(`${backend}/relationships`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	return (await req.json()) as {
		values: Relationship<L,T,R>[];
		count: number;
	};
}

export async function getCollatedRelationships<L extends KnownType, T extends KnownType, R extends KnownType>(fetch: FetchFunc, bodies: RelationshipQuery<L,T,R>[]) {
	const res = await Promise.all(bodies.map((b) => getRelationships(fetch, b)));
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
