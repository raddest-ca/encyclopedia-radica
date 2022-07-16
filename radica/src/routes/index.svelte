<script lang="ts">
	import type { Thing } from "$lib/core";
	import { mapRelationship } from "$lib/data-helper";
	import { getRelationships, getThings } from "$lib/requesting";

	let memes: Thing[] = [];
	let names: Map<string, string>;

	async function main() {
		memes = await getThings({
			type: {
				id: "meme",
				version: "1.0.0",
			},
		});

		names = mapRelationship(
			await getRelationships({
				leftType: {
					id: "meme",
					version: "1.0.0",
				},
				type: {
					id: "name",
					version: "1.0.0",
				},
				rightType: {
					id: "literal",
					version: "1.0.0",
				},
			}),
		);
	}
	main().catch(console.error);
</script>

<h1>Memes</h1>
<ul>
	{#each memes as m}
		<li>{m} - {names.get(m)}</li>
	{/each}
</ul>
