<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ params }: LoadEvent): Promise<LoadOutput> {
		return {
			props: {
				id: params.id,
			},
		};
	}
</script>

<script lang="ts">
	import CopyButton from "../../../components/CopyButton.svelte";
	import { _ } from "svelte-i18n";

	export let id: string;
</script>

<div class="place-content-center w-96 bg-base-300 mx-auto mt-4 p-4 rounded-xl drop-shadow-xl">
	<div class="flex items-center justify-center">
		<CopyButton css="text-primary h-10 w-10 hover:text-secondary" bind:value={id} />
	</div>
	<div>
		<span class="lquo">&ldquo;</span>
		<span id="id">{id}</span>
		<span class="rquo">&rdquo;</span>
	</div>
</div>

<style>
	#id {
		/* font-size: 66pt; */
		word-wrap: break-word;
	}
	.lquo {
		position: absolute;
		left: -80px;
		top: -20%;
		font-size: 99pt;
		user-select: none;
	}
	.rquo {
		position: absolute;
		left: calc(100% + 30px);
		top: -20%;
		font-size: 99pt;
		user-select: none;
	}
</style>
