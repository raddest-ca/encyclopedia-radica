<script lang="ts">
	import { _ } from "svelte-i18n";
	import { backends } from "$lib/backends";
	import { page } from "$app/stores";

	$: active = $backends.filter((x) => x.active).length;
	$: crumbs = $page.url.pathname.substr(1).split("/");

	function getHref(index: number, crumbs: string[]) {
		return "/" + crumbs.slice(0, index + 1).join("/");
	}
</script>

<nav class="navbar justify-between bg-base-200 flex-wrap gap-2">
	<div class="lg:w-full">
		<a href="/things" class="btn btn-ghost normal-case text-xl">{$_("nav.name")}</a>
	</div>
	<div class="lg:w-full">
		<div class="text-sm breadcrumbs mt-1">
			<ul>
				{#each crumbs as v, i}
					<li><a class="crumb" href={getHref(i, crumbs)}>{v}</a></li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="lg:w-full">
		<a href="/backends" class="hover:link-hover">
			{$_("nav.backends", {
				values: {
					active,
					total: $backends.length,
				},
			})}
		</a>
	</div>
</nav>

<style>
	.crumb {
		display: block;
		white-space: nowrap;
		max-width: max(200px, 40vw);
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
