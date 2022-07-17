import { derived, writable } from "svelte/store";
import { browser } from "$app/env";

function getStoredIfExists(key: string) {
    if (key in localStorage)
        return JSON.parse(localStorage[key]);
    else
        return null;
}

function writableStorage<T>(key: string, fallback: T) {
    if (!browser) return writable(fallback);
    const existing = getStoredIfExists(key);
    const store = writable<T>(existing ?? fallback);
    store.subscribe(v => localStorage[key] = JSON.stringify(v));
    addEventListener("storage", event => {
        if (event.key !== key) return;
        if (event.newValue === JSON.stringify(store)) return;    
        store.set(event.newValue as any);
    });
    return store;
}

export interface Backend {
    name: string;
    uri: string;
    comment: string;
    active: boolean;
}

export const backends = writableStorage("backends", [] as Backend[]);
export const activeBackends = derived(backends, $backends => $backends.filter(x => x.active));
