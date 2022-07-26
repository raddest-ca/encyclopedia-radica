<script lang="ts">
	import { _ } from "svelte-i18n";
	import { backends, type Backend } from "$lib/backends";
	import { fly } from "svelte/transition";
	import { backend } from "$lib/requesting";

	function validate(submitting: boolean) {
		const old = errors;
		errors = [];
		if (name.length === 0) {
			errors.push(
				$_("warning.required", { values: { name: $_("route.backends.index.form.name") } }),
			);
		}
		if (uri.length === 0) {
			errors.push(
				$_("warning.required", { values: { name: $_("route.backends.index.form.uri") } }),
			);
		}
		if (!submitting) errors = errors.filter((x) => old.includes(x));
		else errors = errors;

		return (valid = errors.length === 0);
	}
	let valid = false;

	function addBlank() {
		name = name.trim();
		uri = uri.trim();
		if (!validate(true)) return;
		backends.update((x) => {
			x.push({
				name,
				active: false,
				uri,
				comment: "",
				useAuth: false,
			});
			return x;
		});
		name = "";
		uri = "";
		success = true;
		clearTimeout(successHandle);
		successHandle = setTimeout(() => (success = false), 2000);
	}

	function deleteBackend(backend: Backend) {
		backends.update((x) => x.filter((y) => y !== backend));
	}

	let errors: string[] = [];

	let success = false;
	let successHandle: NodeJS.Timeout | undefined;

	let editingForms: Map<Backend, boolean> = new Map();
	function toggleEditing(backend: Backend) {
		editingForms.set(backend, !(editingForms.get(backend) ?? false));
		editingForms = editingForms;
	}

	function fixBackends() {
		backends.update((list) =>
			list.map((b) => {
				if (b.useAuth && b.auth === undefined) {
					b.auth = {
						userId: "",
						token: "",
					};
				} else if (!b.useAuth && b.auth?.userId == "" && b.auth?.token == "") {
					delete b.auth;
				}
				return b;
			}),
		);
		console.log("updating", $backends[0].auth);
	}

	let name = "";
	let uri = "";
</script>

<div class="content m-2">
	<h1 class="text-xl inline">{$_("route.backends.index.header")}</h1>
	<span class="float-right">todo: add export and import using clipboard</span>
	<br />
	{#if $backends.length === 0}
		<p>{$_("route.backends.index.none")}</p>
	{:else}
		<div class="flex flex-wrap justify-around">
			{#each $backends as backend, i}
				{@const editing = editingForms.get(backend) === true}

				<div
					class="rounded bg-neutral p-1 px-2 m-1 flex-auto max-w-lg shadow-xl border-primary border-2"
				>
					{#if editing}
						<!-- Edit icon -->
						<svg
							on:click={() => toggleEditing(backend)}
							xmlns="http://www.w3.org/2000/svg"
							class="ml-4 mt-1.5 h-4 w-4 float-right hover:cursor-pointer"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class:text-primary={editing}
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
						<!-- Delete icon -->
						<svg
							on:click={() => deleteBackend(backend)}
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
					{/if}

					<form id="edit-form-{i}">
						<!-- Name -->
						{#if editing}
							<div class="form-control">
								<label for="edit-form-{i}-name" class="label">
									<span class="label-text">{$_("route.backends.index.form.name")}</span>
									<span class="label-text-alt text-red-500">{$_("required")}</span>
								</label>
								<input
									id="edit-form-{i}-name"
									type="text"
									bind:value={backend.name}
									placeholder={$_("route.backends.index.form.name.placeholder")}
									class="input input-bordered w-full max-w-xs placeholder-slate-600"
								/>
							</div>
						{:else}
							<span class="text-lg text-neutral-content mr-5">{backend.name}</span>
						{/if}

						{#if !editing}
							<!-- Edit icon -->
							<svg
								on:click={() => toggleEditing(backend)}
								xmlns="http://www.w3.org/2000/svg"
								class="ml-4 mt-1.5 h-4 w-4 float-right hover:cursor-pointer"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								class:text-primary={editing}
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
								/>
							</svg>
						{/if}

						<!-- Active checkbox -->
						<div class="form-control">
							<label class="label cursor-pointer my-4">
								<span class="label-text"> {$_("route.backends.index.active")}</span>
								<input
									disabled={!editing}
									type="checkbox"
									bind:checked={backend.active}
									class="checkbox checkbox-primary"
								/>
							</label>
						</div>

						<!-- URI -->
						{#if editing}
							<div class="form-control">
								<label for="edit-form-{i}-uri" class="label">
									<span class="label-text">{$_("route.backends.index.form.uri")}</span>
									<span class="label-text-alt text-red-500">{$_("required")}</span>
								</label>
								<input
									id="edit-form-{i}-uri"
									type="text"
									bind:value={backend.uri}
									placeholder={$_("route.backends.index.form.uri.placeholder")}
									class="input input-bordered w-full max-w-xs placeholder-slate-600"
								/>
							</div>
						{:else}
							<div><a class="link link-primary mr-5" href={backend.uri}>{backend.uri}</a></div>
						{/if}
						<!-- Use auth checkbox -->
						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text"> {$_("route.backends.index.use_auth")}</span>
								<input
									disabled={!editing}
									type="checkbox"
									bind:checked={backend.useAuth}
									on:change={fixBackends}
									class="checkbox checkbox-primary"
								/>
							</label>
						</div>

						<!-- Auth form -->
						{#if editing}
							{#if backend.useAuth && backend.auth !== undefined}
								<form class="mb-1">
									<div class="form-control">
										<label for="edit-form-{i}" class="label">
											<span class="label-text"
												>{$_("route.backends.index.edit-form.auth.userid")}</span
											>
											<span class="label-text-alt text-red-500">{$_("required")}</span>
										</label>
										<input
											id="edit-form-{i}-name"
											type="text"
											bind:value={backend.auth.userId}
											placeholder={$_("route.backends.index.edit-form.auth.userid.placeholder")}
											class="input input-bordered w-full max-w-xs placeholder-slate-600"
										/>
									</div>
									<div class="form-control">
										<label for="edit-form-{i}" class="label">
											<span class="label-text"
												>{$_("route.backends.index.edit-form.auth.token")}</span
											>
											<span class="label-text-alt text-red-500">{$_("required")}</span>
										</label>
										<input
											id="edit-form-{i}-name"
											type="text"
											bind:value={backend.auth.token}
											placeholder={$_("route.backends.index.edit-form.auth.token.placeholder")}
											class="input input-bordered w-full max-w-xs placeholder-slate-600"
										/>
									</div>
								</form>
							{/if}
						{:else}
							<div class="text-neutral-content">
								<p>
									{$_("route.backends.index.auth.user_id", {
										values: { value: backend.auth?.userId },
									})}
								</p>
								<p>
									{$_("route.backends.index.auth.token", {
										values: { value: backend.auth?.token },
									})}
								</p>
							</div>
						{/if}
					</form>
				</div>
			{/each}
		</div>
	{/if}

	<h1 class="text-xl mt-7">{$_("route.backends.index.form.header")}</h1>

	<form style="margin-m">
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
				on:input={() => validate(false)}
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
				on:input={() => validate(false)}
				required
			/>
		</div>
		<div class="form-control max-w-fit mt-2">
			<button on:click|preventDefault={addBlank} type="submit" class="btn btn-primary"
				>{$_("route.backends.index.addButton")}</button
			>
		</div>
	</form>

	{#if success}
		<div
			class="alert alert-success shadow-lg my-2 max-w-lg"
			transition:fly={{ y: 50, duration: 1000 }}
		>
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
		<div class="alert alert-warning shadow-lg my-2 max-w-lg">
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
</div>
