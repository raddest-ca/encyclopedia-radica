import type { Relationship } from "./core";
import type { KnownType } from "./known-types";
import { writable } from "svelte/store";
import { browser } from "$app/env";

export function toMap<T, Y>(list: T[], propGetter: (v: T) => string, valueGetter: (v: T) => Y) {
	return list.reduce((map, v) => {
		map.set(propGetter(v), valueGetter(v));
		return map;
	}, new Map<string, Y>());
}

export function mapRelationship<L extends KnownType, T extends KnownType, R extends KnownType>(
	rels: Relationship<L, T, R>[],
) {
	return rels.reduce((map, v) => {
		const existing = map.get(v.left.id);
		if (existing !== undefined) {
			existing.push(v.right.id);
		} else {
			map.set(v.left.id, [v.right.id]);
		}
		return map;
	}, new Map<string, Array<string>>());
}

// export function join(things: Thing[], rels: Relationship[], side: "left" | "right") {
//     const keys = things.reduce((map,v) => {
//         map[v.id] = v;
//         return map;
//     },{} as Record<string, Either>);
//     const offSide = side === "left" ? "right" : "left";
//     return rels.map(rel => keys[rel[side].id]);
// }

function getStoredIfExists(key: string) {
	if (key in localStorage) {
		try {
			return JSON.parse(localStorage[key]);
		} catch (e) {
			return null;
		}
	} else {
		return null;
	}
}

export function writableStorage<T>(key: string, fallback: T) {
	if (!browser) return writable(fallback);
	const existing = getStoredIfExists(key);
	const store = writable<T>(existing ?? fallback);
	store.subscribe((v) => (localStorage[key] = JSON.stringify(v)));
	addEventListener("storage", (event) => {
		if (event.key !== key) return;
		if (event.newValue === JSON.stringify(store)) return;
		try {
			const localStorageValue = JSON.parse(event.newValue!);
			store.set(localStorageValue);
		} catch (e) {
			store.set(fallback);
		}
	});
	return store;
}
