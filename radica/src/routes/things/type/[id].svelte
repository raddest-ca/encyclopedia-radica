<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings(fetch, {
			filter: {
				type: {
					id: decodeURIComponent(params.id),
				},
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
	import { getThings, type ThingResults } from "$lib/requesting";
	import { _ } from "svelte-i18n";
	import type { Thing } from "$lib/core";

	export let things: Required<ThingResults>;

	function getHref(thing: Thing) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `../${encodeURIComponent(thing.type.id)}/${encodeURIComponent(thing.id)}`;
		return rtn;
	}
</script>

<main class="place-content-center drop-shadow-2xl w-2/3 mx-auto mt-10 rounded-xl p-4 bg-base-200">
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
			</tr>
		</thead>
		<tbody>
			{#each things.values as thing, i}
				<tr>
					<td>{thing.type.id}</td>
					<td>{thing.type.version}</td>
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

	#type,
	#typeid,
	#typeversion {
		@apply bg-primary-focus;
	}
</style>
