<script lang="ts">
	import { _ } from "svelte-i18n";
</script>

<div class="w-96 border-xl p-4 mt-4 m-auto bg-base-300">
	<h1>{$_("route.things.unhandled_type.body")}</h1>
	<br />
	<button class="link" on:click={() => history.back()}>{$_("action.browser.back")}</button>
</div>
