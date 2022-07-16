<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		console.log("load method called", params);
		const types = await getThings({ type: knownTypes.type });
		const ids = await getRelationships({
			leftType: knownTypes.type,
			type: knownTypes.identifier,
			rightType: knownTypes.string,
		});
		return {
			props: {
				types,
				ids,
			},
		};
	}
</script>

<script lang="ts">
	import type { Relationship, Thing, Type } from "$lib/core";
	import { getRelationships, getThings } from "$lib/requesting";
	import { knownTypes } from "$lib/known-types";
	import { mapRelationship } from "$lib/data-helper";
	import { _ } from "svelte-i18n";

	export let types: Type[];
	export let ids: Relationship[];

	$: idLookup = mapRelationship(ids);
</script>

<h1>Types</h1>

<p>Loaded {types.length} types and {ids.length} ids.</p>

<table>
	<thead>
		<tr>
			<th>{$_("resource.id")}</th>
			<th>{$_("id")}</th>
		</tr>
	</thead>
	<tbody>
		{#each types as t}
			<tr>
				<td>{t.id}</td>
				<td>{idLookup.get(t.id)}</td>
			</tr>
		{/each}
	</tbody>
</table>
