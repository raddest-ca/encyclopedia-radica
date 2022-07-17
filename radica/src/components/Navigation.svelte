<script lang="ts">
	import { _ } from "svelte-i18n";
	import { backends } from "$lib/backends";

	$: active = $backends.filter((x) => x.active).length;
</script>

<div class="navbar-start">
	<a href="/" class="btn btn-ghost normal-case text-xl">{$_("nav.name")}</a>
</div>
<div class="navbar-end">
	<a href="/backends" class="hover:link-hover">
		{$_("nav.backends", {
			values: {
				active,
				total: $backends.length,
			},
		})}
	</a>
</div>
