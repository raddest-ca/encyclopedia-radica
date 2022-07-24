<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings(fetch, {
			filter: {
				type: {
					id: knownTypes.type.id,
				},
			},
		});

		const thingCounts = await Promise.all(
			things.values!.map((x) =>
				getThings(fetch, {
					filter: {
						type: {
							id: x.id,
						},
					},
					countOnly: true,
				}),
			),
		);

		const relCounts = await Promise.all(
			things.values!.map((x) =>
				getRelationships(fetch, {
					filter: {
						type: {
							id: x.id,
						},
					},
					countOnly: true,
				}),
			),
		);

		return {
			props: {
				things,
				thingCounts,
				relCounts,
			},
		};
	}
</script>

<script lang="ts">
	import {
		getCollatedRelationships,
		getCollatedThings,
		getRelationships,
		getThings,
		type RelationshipResults,
		type ThingResults,
	} from "$lib/requesting";
	import { _ } from "svelte-i18n";
	import { knownTypes } from "$lib/known-types";
	import type { Thing } from "$lib/core";

	export let things: ThingResults;
	export let thingCounts: ThingResults[];
	export let relCounts: RelationshipResults[];

	function getHref(thing: Thing) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `./type/${encodeURIComponent(thing.id)}/`;
		return rtn;
	}
</script>

<main
	class="place-content-center drop-shadow-2xl m-auto mt-10 rounded-xl p-4 bg-base-200"
	style="width: 600px;"
>
	<p>
		{$_("route.things.type.index.discovered", {
			values: {
				count: things.count,
			},
		})}
	</p>
	<table class="mt-2">
		<thead>
			<tr>
				<th id="type" colspan="2">{$_("type")}</th>
			</tr>
			<tr>
				<th id="typeid">{$_("id")}</th>
				<th id="typeversion">{$_("version")}</th>
				<th>{$_("id")}</th>
				<th>{$_("count.things")}</th>
				<th>{$_("count.relationships")}</th>
			</tr>
		</thead>
		<tbody>
			{#each things.values as thing, i}
				<tr>
					<td>{thing.type.id}</td>
					<td>{thing.type.version}</td>
					<td><a class="link" href={getHref(thing)}>{thing.id}</a></td>
					<td>{thingCounts[i].count}</td>
					<td>{relCounts[i].count}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>

<style>
	th {
		@apply bg-primary text-primary-content;
	}
	td,
	th {
		@apply m-2 p-2 border-2 border-primary;
	}

	#type,
	#typeid,
	#typeversion {
		@apply bg-primary-focus;
	}
</style>
