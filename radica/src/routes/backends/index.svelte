<script lang="ts">
	import { _ } from "svelte-i18n";
	import { backends, type Backend } from "$lib/backends";
	import { fly } from "svelte/transition";

	function addBlank() {
		name = name.trim();
		uri = uri.trim();
		errors = [];
		if (name.length === 0) {
			errors.push("Name bad");
		}
		if (uri.length === 0) {
			errors.push("Uri bad");
		}
		errors = errors;
		if (errors.length > 0) return;
		// backends.update((x) => {
		// 	x.push({
		// 		name,
		// 		active: false,
		// 		uri,
		// 		comment: "",
		// 	});
		// 	return x;
		// });
		success = true;
		clearTimeout(successHandle);
		successHandle = setTimeout(() => (success = false), 2000);
	}

	function deleteBackend(backend: Backend) {
		backends.update((x) => x.filter((y) => y !== backend));
	}

	let errors: string[] = ["beans", "deas"];

	let success = false;
	let successHandle: NodeJS.Timeout | undefined;

	let name = "";
	let uri = "";
</script>

<div class="content m-2">
	<h1 class="text-xl">{$_("route.backends.index.header")}</h1>
	{#if $backends.length === 0}
		<p>{$_("route.backends.index.none")}</p>
	{:else}
		<div class="flex flex-wrap justify-around">
			{#each $backends as backend}
				<div class="rounded bg-neutral p-1 m-1 flex-auto max-w-lg">
					<!-- Name -->
					<span class="text-lg text-neutral-content mr-5">{backend.name}</span>

					<!-- Trash icon -->
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

					<!-- URI -->
					<span><a class="link link-primary mr-5" href={backend.uri}>{backend.uri}</a></span>
				</div>
			{/each}
		</div>
	{/if}

	<h1 class="text-xl mt-7">{$_("route.backends.index.form.header")}</h1>

	{#if success}
		<div class="alert alert-success shadow-lg" transition:fly={{ y: 50, duration: 1000 }}>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{$_("route.backends.index.form.success")}</span>
			</div>
		</div>
	{/if}
	{#each errors as e}
		<div class="alert alert-warning shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/></svg
				>
				<span>{e}</span>
			</div>
		</div>
	{/each}
	<form class="ml-1">
		<div class="form-control w-full max-w-xs">
			<label for="name" class="label">
				<span class="label-text"> {$_("route.backends.index.form.name")}</span>
				<span class="label-text-alt text-red-500">{$_("required")}</span>
			</label>
			<input
				id="name"
				type="text"
				placeholder={$_("route.backends.index.form.name.placeholder")}
				class="input input-bordered w-full max-w-xs"
				bind:value={name}
				required
			/>
		</div>
		<div class="form-control w-full max-w-xl">
			<label for="name" class="label">
				<span class="label-text"> {$_("route.backends.index.form.uri")}</span>
				<span class="label-text-alt text-red-500">{$_("required")}</span>
			</label>
			<input
				id="name"
				type="text"
				placeholder={$_("route.backends.index.form.uri.placeholder")}
				class="input input-bordered w-full max-w-xl"
				bind:value={uri}
				required
			/>
		</div>
		<div class="form-control max-w-fit mt-2">
			<button on:click|preventDefault={addBlank} type="submit" class="btn btn-primary"
				>{$_("route.backends.index.addButton")}</button
			>
		</div>
	</form>
</div>
