<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";
	import { getRelationships } from "$lib/requesting";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		const uris = await getRelationships(fetch, {
			filter: {
				left: {
					type: knownTypes.video,
					id: decodeURIComponent(params.id),
				},
				type: knownTypes.uri,
				right: {
					type: knownTypes.string,
				},
			},
		});
		return {
			props: {
				id: decodeURIComponent(params.id),
				uris: uris.map((x) => x.right.id),
			},
		};
	}
</script>

<script lang="ts">
	import CopyButton from "../../../lib/components/CopyButton.svelte";
	import { _ } from "svelte-i18n";
	import { knownTypes } from "$lib/known-types";

	export let id: string;
	export let uris: string[];

	function getFileType(uri: string) {
		return uri.substr(uri.lastIndexOf(".") + 1);
	}
</script>

<div class="flex justify-center">
	<div class="w-40 invisible" />
	<main class="place-content-center w-96 bg-base-300 mx-auto mt-4 p-4 rounded-xl drop-shadow-xl">
		<!-- TODO: find good example videos for adding caption support -->
		<!-- svelte-ignore a11y-media-has-caption -->
		<video controls>
			{#each uris as uri}
				<source src={uri} type="video/{getFileType(uri)}" />
			{/each}
		</video>
	</main>
	<div class="w-40">
		<div class="flex place-content-center w-full mt-20">
			<div class="bg-primary rounded-full w-12 h-12 flex place-content-center">
				<CopyButton css="text-primary-content h-8 w-8 hover:text-secondary" bind:value={id} />
			</div>
		</div>
	</div>
</div>
