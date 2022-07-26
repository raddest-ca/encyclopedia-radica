import { derived } from "svelte/store";
import { writableStorage } from "./data-helper";

export interface BackendContext {
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

export const backends = writableStorage("backend_contexts", [] as BackendContext[]);
export const activeBackends = derived(backends, ($backends) => $backends.filter((x) => x.active));
