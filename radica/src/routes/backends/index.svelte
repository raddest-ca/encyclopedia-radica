<script lang="ts">
	import { _ } from "svelte-i18n";
	import { backends, type Backend } from "$lib/backends";

	function addBlank() {
		backends.update((x) => {
			x.push({
				name: "myBackend",
				active: false,
				uri: "https://data.beans.example.com",
				comment: "",
			});
			return x;
		});
	}

	function deleteBackend(backend: Backend) {
		backends.update((x) => x.filter((y) => y !== backend));
	}
</script>

<div class="content m-2">
	<h1 class="text-xl">{$_("route.backends.index.header")}</h1>
	{#if $backends.length === 0}
		<p>{$_("route.backends.index.none")}</p>
	{:else}
		{#each $backends as backend}
			<div class="rounded bg-neutral p-1 m-1 max-w-fit">
				<span class="text-lg text-neutral-content mr-5">{backend.name}</span>
				<svg
					on:click={(e) => deleteBackend(backend)}
					xmlns="http://www.w3.org/2000/svg"
					class="ml-4 mt-1.5 h-4 w-4 float-right hover:cursor-pointer"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>

				<!-- Active checkbox -->
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text"> {$_("route.backends.index.active")}</span>
						<input
							type="checkbox"
							bind:checked={backend.active}
							class="checkbox checkbox-primary"
						/>
					</label>
				</div>

				<span><a class="link link-primary mr-5" href={backend.uri}>{backend.uri}</a></span>
			</div>
		{/each}
	{/if}

	<h1 class="text-xl mt-7">{$_("route.backends.index.form.header")}</h1>
	<form class="ml-1">
		<div class="form-control w-full max-w-xs">
			<label for="name" class="label">
				<span class="label-text"> {$_("name")}</span>
			</label>
			<input
				id="name"
				type="text"
				placeholder={$_("route.backends.index.form.name.placeholder")}
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<div class="form-control max-w-fit mt-2">
			<button on:click|preventDefault={addBlank} type="submit" class="btn btn-primary"
				>{$_("route.backends.index.addButton")}</button
			>
		</div>
	</form>
</div>
