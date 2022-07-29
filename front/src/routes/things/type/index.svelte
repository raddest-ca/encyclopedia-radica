<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";
	import { countRelationships, countThings, getThings } from "$lib/requesting";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings(fetch, {
			filter: {
				type: knownTypes.type,
			},
		});

		const thingCounts = await Promise.all(
			things.map((x) =>
				countThings(fetch, {
					filter: {
						type: x.id as KnownType,
					},
				}),
			),
		);

		const relCounts = await Promise.all(
			things.map((x) =>
				countRelationships(fetch, {
					filter: {
						type: x.id as KnownType,
					},
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
	import { _ } from "svelte-i18n";
	import { knownTypes, type KnownType } from "$lib/known-types";
	import type { Thing } from "$lib/core";

	export let things: Thing<"type">[];
	export let thingCounts: number[];
	export let relCounts: number[];

	function getHref(thing: Thing<KnownType>) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `./type/${encodeURIComponent(thing.id)}/`;
		return rtn;
	}
</script>

<main
	class="place-content-center flex flex-wrap flex-col drop-shadow-2xl m-auto mt-10 rounded-xl p-4 bg-base-200"
	style="max-width: 600px;"
>
	<p class="text-center">
		{$_("route.things.type.index.discovered", {
			values: {
				count: things.length,
			},
		})}
	</p>
	<table class="mt-2">
		<thead>
			<tr>
				<th>{$_("type")}</th>
				<th>{$_("id")}</th>
				<th>{$_("count.things")}</th>
				<th>{$_("count.relationships")}</th>
			</tr>
		</thead>
		<tbody>
			{#each things as thing, i}
				<tr>
					<td>{thing.type}</td>
					<td><a class="link" href={getHref(thing)}>{thing.id}</a></td>
					<td>{thingCounts[i]}</td>
					<td>{relCounts[i]}</td>
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
</style>
