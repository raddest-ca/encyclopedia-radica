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
	};
}

export const defaultBackend: Backend = {
	name: "radica",
	active: true,
	uri: "http://localhost/",
	comment: "default backend",
	useAuth: false,
};

export const backends = writableStorage("backend_contexts", [{ ...defaultBackend }] as Backend[]);
export const activeBackends = derived(backends, ($backends) => $backends.filter((x) => x.active));
