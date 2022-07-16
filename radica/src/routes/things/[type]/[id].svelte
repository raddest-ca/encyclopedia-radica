<script lang="ts">
	import { _ } from "svelte-i18n";
</script>

<h1>There is no renderer available for this type.</h1>
<a href="#" on:click={() => history.back()}>{$_("action.browser.back")}</a>
