<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings({
			filter: {
				type: {
					id: knownTypes.type.id,
				},
			},
		});
		const thingCounts = await Promise.all(
			things.values!.map((x) =>
				getThings({
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
				// ids,
			},
		};
	}
</script>

<script lang="ts">
	import { getThings, type ThingResults } from "$lib/requesting";
	import { _ } from "svelte-i18n";
	import { knownTypes } from "$lib/known-types";

	export let things: Required<ThingResults>;
	export let thingCounts: ThingResults[];
</script>

<h1>{$_("route.things.type.index.header")}</h1>

<p>
	{$_("route.things.type.index.discovered", {
		values: {
			count: things.count,
		},
	})}
</p>

<table>
	<thead>
		<tr>
			<th colspan="2">{$_("type")}</th>
		</tr>
		<tr>
			<th>{$_("id")}</th>
			<th>{$_("version")}</th>
			<th>{$_("id")}</th>
			<th>{$_("count.things")}</th>
		</tr>
	</thead>
	<tbody>
		{#each things.values as thing, i}
			<tr>
				<td>{thing.type.id}</td>
				<td>{thing.type.version}</td>
				<td><a href="./type/{thing.id}">{thing.id}</a></td>
				<td>{thingCounts[i]?.count}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	th {
		border: 2px solid black;
	}
	td {
		border: 1px solid black;
	}
</style>
