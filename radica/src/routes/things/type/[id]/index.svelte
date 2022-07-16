<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		console.log("load method called", params);
		const types = await getThings({
			type: {
				id: params.id,
			},
		});
		// const ids = await getRelationships({
		// 	leftType: knownTypes.type,
		// 	type: knownTypes.identifier,
		// 	rightType: knownTypes.string,
		// });
		return {
			props: {
				types,
				// ids,
			},
		};
	}
</script>

<script lang="ts">
	import type { Relationship, Thing } from "$lib/core";
	import { getRelationships, getThings } from "$lib/requesting";
	import { knownTypes } from "$lib/known-types";
	import { mapRelationship } from "$lib/data-helper";
	import { _ } from "svelte-i18n";

	export let types: Thing[];
	// export let ids: Relationship[];

	// $: idLookup = mapRelationship(ids);
</script>

<h1><a href="../type/1.0.0">Types</a></h1>

<p>Loaded {types.length} types.</p>

<table>
	<thead>
		<tr>
			<th colspan="2">{$_("type")}</th>
		</tr>
		<tr>
			<th>{$_("id")}</th>
			<th>{$_("version")}</th>
			<th>{$_("id")}</th>
		</tr>
	</thead>
	<tbody>
		{#each types as t}
			<tr>
				<td>{t.type.id}</td>
				<td>{t.type.version}</td>
				<td><a href="./{t.id}">{t.id}</a></td>
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
