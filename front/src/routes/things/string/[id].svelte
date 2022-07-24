<script lang="ts" context="module">
	import type { LoadEvent, LoadOutput } from "@sveltejs/kit";

	export async function load({ params }: LoadEvent): Promise<LoadOutput> {
		return {
			props: {
				id: decodeURIComponent(params.id),
			},
		};
	}
</script>

<script lang="ts">
	import CopyButton from "../../../components/CopyButton.svelte";
	import { _ } from "svelte-i18n";

	export let id: string;
</script>

<div class="flex justify-center">
	<div class="w-40 invisible" />
	<main class="place-content-center w-96 bg-base-300 mx-auto mt-4 p-4 rounded-xl drop-shadow-xl">
		<div>
			<span class="lquo">&ldquo;</span>
			<span id="id">{id}</span>
			<span class="rquo">&rdquo;</span>
		</div>
	</main>
	<div class="w-40">
		<div class="flex place-content-center w-full mt-20">
			<div class="bg-primary rounded-full w-12 h-12 flex place-content-center">
				<CopyButton css="text-primary-content h-8 w-8 hover:text-secondary" bind:value={id} />
			</div>
		</div>
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
