<script lang="ts">
	import { _ } from "svelte-i18n";
	export let css = "h-6 w-6";
	export let value = "";
	let notif = false;
	function save(value: string) {
		navigator.clipboard.writeText(value);
		notif = true;
		setTimeout(() => (notif = false), 1750);
	}
	import { fly, fade } from "svelte/transition";
	import type { FlyParams } from "svelte/transition";
	const anim: FlyParams = {};
</script>

<button type="button" class="cursor-pointer" on:click={() => save(value)}>
	{#if notif}
		<svg
			in:fly={{ y: 200, duration: 200 }}
			xmlns="http://www.w3.org/2000/svg"
			class={css}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
			/>
		</svg>
	{:else}
		<svg
			in:fade
			xmlns="http://www.w3.org/2000/svg"
			class={css}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
			/>
		</svg>
	{/if}
</button>
