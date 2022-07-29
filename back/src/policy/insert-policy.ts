import { createLogger } from "bunyan";
import { ApiResponse } from "../common/api-response";
import { $_, keys, ParameterizedMessage } from "../common/server-i18n";
import { config } from "../config";
import { Relationship, Thing } from "../common/core";
import { KnownType } from "../models/known-types";
import { InsertableThing, InsertPayload } from "../routes/insert";
import { dereference } from "./util";
import { ServerResponse } from "http";
import { App } from "../app";

type PolicyResult = ({ result: "APPROVE" } | { result: "DENY"; errors: ParameterizedMessage[] }) &
	({ thing: Thing<KnownType> } | { relationship: Relationship<KnownType, KnownType, KnownType> });

interface PolicyPayload {
	things: Thing<KnownType>[];
	relationships: Relationship<KnownType, KnownType, KnownType>[];
}

const logger = createLogger({ name: "policy", level: config.log_level });

// function HashUserPassword(body: PolicyPayload): ApiResponse<PolicyPayload> {
// 	return {
// 		value: body,
// 		success: true,
// 	};
// }

// function AllowNewUsers(body: PolicyPayload): ApiResponse<PolicyPayload> {
// 	// const newUsers = body.queue.things.filter(x => x.type === "user");
// 	// for (const user of newUsers) {
// 	// 	const slugs = body.queue.th
// 	// }
// 	return {
// 		value: body,
// 		success: true,
// 	};
// }

// async function* OneSlugPerUser(app: App, body: PolicyPayload) {
// 	const newSlugs: Relationship<"user", "slug", "string">[] = body.relationships.filter(
// 		r => r.left.type === "user" && r.type === "slug" && r.right.type === "string",
// 	).map(r => r as Relationship<"useR", "slug", "string">);
// 	const slugsByUser = newSlugs.reduce((acc, v) => {
// 		if (!(v.left.id in acc)) acc[v.left.id] = [];
// 		acc[v.left.id].push(v);
// 		return acc;
// 	}, {} as Record<string, Relationship<"user", "slug", "string">[]>);
// 	for (const [user, slugs] of Object.entries(slugsByUser)) {
// 		const getExistingSlugs = async () =>
// 			await app.store.getRelationships({
// 				filter: {
// 					left: {
// 						type: "user",
// 						id: user,
// 					},
// 					type: "slug",
// 					right: {
// 						type: "string",
// 					},
// 				},
// 				countOnly: true,
// 			});
// 		// make func to avoid querying if other error found
// 		if (slugs.length !== 1 && (await getExistingSlugs()).count > 0) {
// 			yield {
// 				result: "DENY",
// 				thing:
// 				errors: [
// 					{
// 						key: keys.policy_user_slug_toomany,
// 						values: [slugs.join(", ")],
// 					}
// 				]
// 			} as PolicyResponse;
// 		}
// 	}
// }

async function* AllowDates(app: App, body: PolicyPayload) {
	const dates = body.things.filter(t => t.type === "date");
	for (const date of dates) {
		if (!/\-?\d\d\d\d\-\d\d\-\d\d/.test(date.id) || isNaN(new Date(date.id).getTime())) {
			// errors.push($_(keys.policy_bad_date));
			yield {
				thing: date,
				result: "DENY",
				errors: [$_(keys.policy_bad_date)],
			} as PolicyResult;
		} else {
			yield {
				thing: date,
				result: "APPROVE",
			} as PolicyResult;
		}
	}
}

// function displayId(thing: Required<InsertableThing>) {
// 	return "idRef" in thing ? thing.idRef : thing.id;
// }

// function DenyDefault(body: PolicyPayload): ApiResponse<PolicyPayload> {
// 	if (body.queue.things.length > 0 || body.queue.relationships.length > 0) {
// 		return {
// 			success: false,
// 			errors: [
// 				...body.queue.things.map(x => $_(keys.policy_unallowed_thing, x.type, displayId(x))),
// 				...body.queue.relationships.map(x =>
// 					$_(
// 						keys.policy_unallowed_relationship,
// 						x.left.type,
// 						displayId(x.left),
// 						x.type,
// 						x.right.type,
// 						displayId(x.right),
// 					),
// 				),
// 			],
// 		};
// 	} else {
// 		return {
// 			value: body,
// 			success: true,
// 		};
// 	}
// }

const policies = [
	AllowDates,
	// DenyDefault,
	// HashUserPassword, AllowNewUsers
];

export async function process(
	app: App,
	body: InsertPayload,
): Promise<
	ApiResponse<{
		things: Thing<KnownType>[];
		relationships: Relationship<KnownType, KnownType, KnownType>[];
	}>
> {
	logger.debug({ body }, "processing begin");
	let iter = 0;

	const deref = dereference(body);
	if (!deref.success) return deref;

	let results: PolicyResult[] = [];
	logger.debug("policy iteration begin");
	for (const policy of policies) {
		logger.debug("policy evaluating %s", policy.name);
		for await (const res of policy(app, deref.value)) {
			results.push(res);
		}
	}
	logger.debug("policy iteration end");

	if (results.filter(x => x.result === "DENY").length === 0) {
		logger.debug(
			{
				success: true,
			},
			"processing end success",
		);
		return {
			value: deref.value,
			success: true,
		};
	} else {
		logger.debug({ success: false, results: results.filter(x => x.result === "DENY") }, "processing end failure");
		return {
			success: false,
			errors: results.flatMap(x => "errors" in x ? x.errors : []),
		};
	}
}
