import type { Either } from "./core";

export interface Transformer {
	id: string;
	apply: Function;
}
