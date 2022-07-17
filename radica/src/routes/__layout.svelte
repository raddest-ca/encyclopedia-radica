<script lang="ts">
	import { setup as setupI18n } from "../i18n/i18n";
	import "../app.css";
	import Navigation from "../components/Navigation.svelte";
	setupI18n();
</script>

<Navigation />

<main>
	<!-- <main style="height: calc(100vh - 4rem)"> -->
	<slot />
</main>
