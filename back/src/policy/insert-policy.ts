import { createLogger } from "bunyan";
import { ApiResponse } from "../common/api-response";
import { $_, keys, ParameterizedMessage } from "../common/i18n";
import { config } from "../config";
import { Relationship, Thing } from "../common/core";
import { KnownType } from "../models/known-types";
import { InsertableThing, InsertPayload } from "../routes/insert";
import { dereference } from "./util";

interface PolicyPayload {
	queue: {
		things: Thing<KnownType>[];
		relationships: Relationship<KnownType,KnownType,KnownType>[];
	},
	done: {
		things: Thing<KnownType>[];
		relationships: Relationship<KnownType,KnownType,KnownType>[];
	},
}

const logger = createLogger({ name: "policy", level: config.log_level });

function HashUserPassword(body: PolicyPayload): ApiResponse<PolicyPayload> {
	return {
		value: body,
		success: true,
	};
}

function AllowNewUsers(body: PolicyPayload): ApiResponse<PolicyPayload> {
	return {
		value: body,
		success: true,
	};
}


function AllowDates(body: PolicyPayload): ApiResponse<PolicyPayload> {
	const dates = body.queue.things.filter(t => t.type === "date");
	const errors: ParameterizedMessage[] = [];
	for (const date of dates) {
		if (!/\-?\d\d\d\d\-\d\d\-\d\d/.test(date.id)) {
			errors.push($_(keys.policy_bad_date))
		}
	}
	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	} else {
		const except = ((it: any[])=>((test: any)=>!it.some(x => x === test)));
		return {
			success: true,
			value: {
				done: {
					relationships: body.done.relationships,
					things: [...body.done.things, ...dates],
				},
				queue: {
					relationships: body.done.relationships,
					things: body.queue.things.filter(except(dates))
				}
			}
		}
	}
}

function displayId(thing: Required<InsertableThing>) {
	return "idRef" in thing ? thing.idRef : thing.id;
}

function DenyDefault(body: PolicyPayload): ApiResponse<PolicyPayload> {
	if (body.queue.things.length > 0 || body.queue.relationships.length > 0) {
		return {
			success: false,
			errors: [
				...body.queue.things.map(x => $_(keys.policy_unallowed_thing, x.type, displayId(x))),
				...body.queue.relationships.map(x =>
					$_(
						keys.policy_unallowed_relationship,
						x.left.type,
						displayId(x.left),
						x.type,
						x.right.type,
						displayId(x.right),
					),
				),
			],
		};
	} else {
		return {
			value: body,
			success: true,
		};
	}
}

const policies = [
	AllowDates,
	DenyDefault,
	// HashUserPassword, AllowNewUsers
];


export function process(body: InsertPayload): ApiResponse<{
	things: Thing<KnownType>[],
	relationships: Relationship<KnownType,KnownType,KnownType>[],
}> {
	logger.debug({ body }, "processing begin");
	let iter = 0;

	const deref = dereference(body);
	if (!deref.success) return deref;

	let processing: PolicyPayload = {
		queue: {
			things: deref.value.things,
			relationships: deref.value.relationships,
		},
		done: {
			things: [],
			relationships: [],
		},
	};

	let errors: ParameterizedMessage[] = [];
	logger.debug("policy iteration begin");
	outer: while (processing.queue.relationships.length > 0 || processing.queue.things.length > 0) {
		if (++iter >= 100) throw new Error("Policy evaluation took too many iterations.");
		logger.debug("policy iteration step begin");
		for (const policy of policies) {
			logger.debug("policy evaluating: %s", policy.name);
			const result = policy(processing);
			logger.debug(result, "policy result");
			if (result.success) {
				processing = result.value;
			} else {
				errors.push(...result.errors);
				break outer;
			}
		}
	}
	logger.debug("policy iteration end");

	if (errors.length === 0) {
		logger.debug(
			{
				success: true,
				relationship_count: processing.done.relationships.length,
				thing_count: processing.done.things.length,
			},
			"processing end success",
		);
		return {
			value: processing.done,
			success: true,
		};
	} else {
		logger.debug({ success: false, errors }, "processing end failure");
		return {
			success: false,
			errors,
		};
	}
}
