import { derived } from "svelte/store";
import { writableStorage } from "./data-helper";

export interface Backend {
	name: string;
	uri: string;
	comment: string;
	active: boolean;
    useAuth: boolean;
    auth?: {
        userId: string;
        token: string;
    }
}

export const backends = writableStorage("backends", [] as Backend[]);
export const activeBackends = derived(backends, ($backends) => $backends.filter((x) => x.active));
