<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings({
			filter: {
				type: {
					id: params.id,
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

	export let things: Required<ThingResults>;
</script>

<div class="place-content-center drop-shadow-2xl w-2/3 mx-auto mt-10 rounded-xl p-4 bg-base-200">
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
					<td><a class="link" href="../{thing.type.id}/{thing.id}">{thing.id}</a></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

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
