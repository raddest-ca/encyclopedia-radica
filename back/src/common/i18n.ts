export const keys = {
	policy_duplicate_id_reference: "policy.duplicate_id_reference",
	policy_unresolved_id_reference: "policy.unresolved_id_reference",
	policy_unallowed_thing: "policy.unallowed.thing",
	policy_unallowed_relationship: "policy.unallowed.relationship",
	policy_bad_date: "policy.date.illegal"
} as const;

export type ServerMessage = typeof keys[keyof typeof keys];

export function $_(key: ServerMessage, ...values: string[]) {
	return {
		key,
		values,
	} as ParameterizedMessage;
}


export interface ParameterizedMessage {
	key: ServerMessage;
	values: string[];
}
