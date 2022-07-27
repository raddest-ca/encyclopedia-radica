<script lang="ts">
	import { setup as setupI18n } from "$lib/i18n";
	import "../app.css";
	import Navigation from "$lib/components/Navigation.svelte";
	setupI18n();
</script>

<Navigation />

<slot />
