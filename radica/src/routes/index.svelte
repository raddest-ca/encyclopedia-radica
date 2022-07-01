<script lang="ts">
	import type { Thing, Type } from "$lib/core";
	import { getRelationships, getThings } from "$lib/requesting";

	let types: {
		id: string;
		typeId: string;
	}[] = [];

	async function main() {
		const t = await getThings({
			type: {
				id: "type",
				version: "1.0.0",
			},
		});

		const ids = await getRelationships({
			type: {
				id: "id",
				version: "1.0.0",
			},
			leftType: {
				id: "type",
				version: "1.0.0",
			},
			rightType: {
				id: "literal",
				version: "1.0.0",
			},
		});

		types = t.map((x) => {
			const id = ids.find((z) => z.left.id === x.id)!;
			return {
				id: x.id,
				typeId: id.right.id,
			};
		});
	}
	main().catch(console.error);
</script>

<h1>Types</h1>
<ul>
	{#each types as t}
		<li><code>{t.id} - {t.typeId}</code></li>
	{/each}
</ul>
