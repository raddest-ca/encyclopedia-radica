<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	import { getCollatedRelationships, getThings } from "$lib/requesting";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const things = await getThings(fetch, {
			filter: {
				type: knownTypes.video,
			},
		});
		console.log(things);
		const uris = await getCollatedRelationships(
			fetch,
			things.map((thing) => ({
				filter: {
					left: {
						id: thing.id,
						type: thing.type,
					},
					type: knownTypes.uri,
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
	import { _ } from "svelte-i18n";
	import { knownTypes, type KnownType } from "$lib/known-types";
	import type { Relationship, Thing } from "$lib/core";
	import { mapRelationship } from "$lib/data-helper";

	export let things: Thing<"video">[];
	export let uris: Relationship<"video", "uri", "string">[];

	$: uriLookup = mapRelationship(uris);

	function getFileType(uri: string) {
		return uri.substr(uri.lastIndexOf(".") + 1);
	}

	function getHref<T extends KnownType>(thing: Thing<T>) {
		// since going in an href attrib as-is, needs to be sanitized twice.
		const rtn = `./video/${encodeURIComponent(thing.id)}/`;
		return rtn;
	}
</script>

<main class="place-content-center drop-shadow-2xl w-96 m-auto mt-10 rounded-xl p-4 bg-base-200">
	<p>
		{$_("route.things.video.index.discovered", {
			values: {
				count: things.length,
			},
		})}
	</p>

	<div class="flex flex-wrap">
		{#each things as thing, i}
			{@const uri = uriLookup.get(thing.id)}

			<div class="bg-base-300 border-primary border-2 p-2 rounded-xl">
				<a class="link" href={getHref(thing)}> {thing.id} </a>
				<!-- TODO: find good example videos for adding caption support -->
				<!-- svelte-ignore a11y-media-has-caption -->
				<video controls>
					{#each uriLookup.get(thing.id) ?? [] as uri}
						<source src={uri} type="video/{getFileType(uri)}" />
					{/each}
				</video>
			</div>
		{/each}
	</div>
</main>

<style>
	/* th {
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
	} */
</style>
