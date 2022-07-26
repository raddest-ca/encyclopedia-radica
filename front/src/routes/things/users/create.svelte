<script lang="ts">
	import { _ } from "svelte-i18n";
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
				placeholder={$_("route.things.users.create.slug.placeholder")}
				class="input input-bordered w-full max-w-xs"
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
				placeholder={$_("route.things.users.create.password.placeholder")}
				class="input input-bordered w-full max-w-xs"
			/>
		</div>

		<div class="mt-2">
			<button type="submit" class="btn btn-primary">{$_("submit")}</button>
		</div>
	</form>
</main>
