<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ fetch, params }: LoadEvent): Promise<LoadOutput> {
		console.log("load method called", params);
		return {
			props: {
				idStr: params["id"],
				idVer: params["version"],
			},
		};
	}
</script>

<script lang="ts">
	export let idStr: string;
	export let idVer: string;
</script>

<p>No handler found for type {idStr} and/or version {idVer}.</p>
