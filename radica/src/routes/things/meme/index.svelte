<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings({
			filter: {
				type: {
					id: knownTypes.meme.id,
				},
			},
		});
		const uris = await getCollatedRelationships(
			things.values!.map((thing) => ({
				filter: {
					left: {
						id: thing.id,
						type: thing.type,
					},
					nature: knownTypes.uri,
					right: {
						type: knownTypes.string,
					},
				},
			})),
		);
		return {
			props: {
				things,
				uris,
				// ids,
			},
		};
	}
</script>

<script lang="ts">
	import {
		getCollatedRelationships,
		getRelationships,
		getThings,
		type RelationshipResults,
		type ThingResults,
	} from "$lib/requesting";
	import { _ } from "svelte-i18n";
	import { knownTypes } from "$lib/known-types";
	import type { Thing } from "$lib/core";
	import { mapRelationship } from "$lib/data-helper";

	export let things: Required<ThingResults>;
	export let uris: Required<RelationshipResults>;

	$: console.log("got", uris);
	$: uriLookup = mapRelationship(uris.values ?? []);

	function getHref(thing: Thing) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `./type/${encodeURIComponent(encodeURIComponent(thing.id))}/`;
		console.log("got", rtn);
		return rtn;
	}
</script>

<main class="place-content-center drop-shadow-2xl w-96 m-auto mt-10 rounded-xl p-4 bg-base-200">
	<p>
		{$_("route.things.meme.index.discovered", {
			values: {
				count: things.count,
			},
		})}
	</p>

	<div class="flex flex-wrap">
		{#each things.values as thing, i}
			<!-- {@const uri = uriLookup.get(thing.id)} -->

			<a class="link" href={getHref(thing)}>
				<div>
					<!-- {uri} -->
					<!-- {#if uriLookup.get(thing.id).endsWith("mp4")}{/if} -->
					{thing.id}
				</div></a
			>
		{/each}
	</div>
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
