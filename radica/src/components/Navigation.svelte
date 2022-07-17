<script lang="ts">
	import { _ } from "svelte-i18n";
	import { backends } from "$lib/backends";

	$: active = $backends.filter((x) => x.active).length;
</script>

<nav class="flex items-center justify-between flex-wrap p-3 bg-red-900">
	<a href="/" class="underline">{$_("nav.home")}</a>
	<div class="float-right underline">
		<a href="/backends">
			{$_("nav.backends", {
				values: {
					active,
					total: $backends.length,
				},
			})}
		</a>
	</div>
</nav>
