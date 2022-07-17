<script lang="ts">
	import { setup as setupI18n } from "../i18n/i18n";
	import "../app.css";
	import Navigation from "../components/Navigation.svelte";
	setupI18n();
</script>

<div class="navbar bg-base-200" style="height: 4rem">
	<Navigation />
</div>

<main style="height: calc(100vh - 4rem)">
	<slot />
</main>
