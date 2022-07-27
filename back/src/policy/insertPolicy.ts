import { createLogger } from "bunyan";
import { ApiResponse } from "../common/apiResponse";
import { $_, keys, ParameterizedMessage } from "../common/i18n";
import { config } from "../config";
import { InsertableThing, InsertPayload } from "../routes/insert";

interface PolicyPayload {
	queue: Required<InsertPayload>;
	done: Required<InsertPayload>;
}

const logger = createLogger({ name: "policy", level: config.log_level });

export type InsertPolicy = (body: PolicyPayload) => ApiResponse<PolicyPayload>;

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

// function AllowDates(body: PolicyPayload): ApiResponse<PolicyPayload> {
// 	return {

// 	}
// }

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
	DenyDefault,
	// HashUserPassword, AllowNewUsers
];

export function process(body: InsertPayload): ApiResponse<Required<InsertPayload>> {
	logger.debug({ body }, "processing begin");
	let iter = 0;

	let processing: PolicyPayload = {
		queue: {
			things: [...(body.things ?? [])],
			relationships: [...(body.relationships ?? [])],
		},
		done: {
			things: [],
			relationships: [],
		},
	};

	let errors: ParameterizedMessage[] = [];
	logger.debug("policy iteration begin");
	outer:
	while (processing.queue.relationships.length > 0 || processing.queue.things.length > 0) {
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
