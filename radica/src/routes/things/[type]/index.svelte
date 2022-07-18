<script lang="ts">
	import { _ } from "svelte-i18n";
	import { page } from "$app/stores";
</script>

<div class="w-96 border-xl p-4 mt-4 m-auto bg-base-300">
	<h1>{$_("route.things.unhandled_type.body")}</h1>
	<br />
	<a href="./type/{$page.params.type}" class="link">{$_("route.things.unhandled_type.view_type")}</a
	>
	<br />
	<button class="link" on:click={() => history.back()}>{$_("action.browser.back")}</button>
</div>
