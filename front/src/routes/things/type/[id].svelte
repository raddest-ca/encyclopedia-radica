<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";
	import { getThings } from "$lib/requesting";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings(fetch, {
			filter: {
				type: decodeURIComponent(params.id) as KnownType,
			},
		});
		return {
			props: {
				things,
			},
		};
	}
</script>

<script lang="ts">
	import { _ } from "svelte-i18n";
	import type { Thing } from "$lib/core";
	import type { KnownType } from "$lib/known-types";

	export let things: Thing<"date">[];

	function getHref(thing: Thing<"date">) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `../${encodeURIComponent(thing.type)}/${encodeURIComponent(thing.id)}`;
		return rtn;
	}
</script>

<main
	class="place-content-center flex flex-wrap flex-col drop-shadow-2xl m-auto mt-10 rounded-xl p-4 bg-base-200"
	style="max-width: 600px;"
>
	<p class="text-center">
		{$_("route.things.type.[id].discovered", {
			values: {
				count: things.length,
			},
		})}
	</p>

	<table class="mt-2">
		<thead>
			<tr>
				<th>{$_("id")}</th>
				<th>{$_("id")}</th>
			</tr>
		</thead>
		<tbody>
			{#each things as thing, i}
				<tr>
					<td>{thing.type}</td>
					<td><a class="link" href={getHref(thing)}>{thing.id}</a></td>
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
