<script lang="ts">
	import type { InsertPayload } from "$lib/common/inserting";

	import Spinner from "$lib/components/Spinner.svelte";
	import { insert } from "$lib/requesting";
	import { _ } from "svelte-i18n";

	let submitEnabled = true;
	function submit() {
		submitEnabled = false;
		insert(fetch, {
			things: [
				{
					type: "user",
					idRef: "myUser",
				},
				// {
				// 	type: "slug",
				// 	id: slug,
				// },
				// {
				// 	type: "password",
				// 	idRef: "pw",
				// },
			],
			// relationships: [
			// 	{

			// 	}
			// ]
		} as InsertPayload);
	}

	let slug: string;
	let password: string;

	let error = "";
</script>

<main class="mx-auto bg-base-200 drop-shadow-2xl mt-10 rounded-xl p-4 max-w-xs">
	<h1>{$_("route.things.users.create.header")}</h1>
	<form>
		<div class="form-control w-full max-w-xs">
			<label for="slug" class="label">
				<span class="label-text">{$_("route.things.users.create.slug")}</span>
				<span class="label-text-alt text-red-500">{$_("required")}</span>
			</label>
			<input
				id="slug"
				type="text"
				bind:value={slug}
				placeholder={$_("route.things.users.create.slug.placeholder")}
				class="input input-bordered w-full max-w-xs placeholder-gray-600"
			/>
		</div>
		<div class="form-control w-full max-w-xs">
			<label for="password" class="label">
				<span class="label-text">{$_("route.things.users.create.password")}</span>
				<span class="label-text-alt text-red-500">{$_("required")}</span>
			</label>
			<input
				id="password"
				type="text"
				bind:value={password}
				placeholder={$_("route.things.users.create.password.placeholder")}
				class="input input-bordered w-full max-w-xs placeholder-gray-600"
			/>
		</div>

		<div class="mt-2 flex">
			<button
				on:click|preventDefault={submit}
				disabled={!submitEnabled}
				type="submit"
				class="btn btn-primary">{$_("submit")}</button
			>
			{#if !submitEnabled}
				<div class="m-auto">
					<Spinner />
				</div>
			{/if}
		</div>

		{#if error}
			<div class="text-red-400 mt-4">{error}</div>
		{/if}
	</form>
</main>
