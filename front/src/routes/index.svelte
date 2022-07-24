<script lang="ts">
	import { _ } from "svelte-i18n";
</script>

<div class="hero overflow-hidden bg-base-200" style="min-height:calc(100vh - 4rem)">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">{$_("route.index.header")}</h1>

			<p class="py-6">
				{$_("route.index.body")}
			</p>
			<a href="/things">
				<button class="btn btn-primary"> {$_("route.index.getstarted")}</button>
			</a>
		</div>
	</div>
</div>
