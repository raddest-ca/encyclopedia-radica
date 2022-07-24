<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings(fetch, {
			filter: {
				type: {
					id: knownTypes.video.id,
				},
			},
		});
		const uris = await getCollatedRelationships(
			fetch,
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

	export let things: ThingResults;
	export let uris: RelationshipResults;

	$: uriLookup = mapRelationship(uris.values ?? []);

	function getFileType(uri: string) {
		return uri.substr(uri.lastIndexOf(".") + 1);
	}

	function getHref(thing: Thing) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `./video/${encodeURIComponent(thing.id)}/`;
		return rtn;
	}
</script>

<main class="place-content-center drop-shadow-2xl w-96 m-auto mt-10 rounded-xl p-4 bg-base-200">
	<p>
		{$_("route.things.video.index.discovered", {
			values: {
				count: things.count,
			},
		})}
	</p>

	<div class="flex flex-wrap">
		{#each things.values as thing, i}
			{@const uri = uriLookup.get(thing.id)}

			<div class="bg-base-300 border-primary border-2 p-2 rounded-xl">
				<a class="link" href={getHref(thing)}> {thing.id} </a>
				<!-- TODO: find good example videos for adding caption support -->
				<!-- svelte-ignore a11y-media-has-caption -->
				<video controls>
					{#each uriLookup.get(thing.id) as uri}
						<source src={uri} type="video/{getFileType(uri)}" />
					{/each}
				</video>
			</div>
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
