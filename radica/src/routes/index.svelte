<script lang="ts">
	import type { Thing, Type } from "$lib/core";
	import { getRelationships, getThings } from "$lib/requesting";

	let types = [];

	async function main() {
		const t = await getThings({
			type: {
				id: "type",
				version: "1.0.0",
			},
		});

		const r = await getRelationships({
			type: {
				id: "id",
				version: "1.0.0",
			},
			leftType: {
				id: "type",
				version: "1.0.0",
			},
		});
		console.dir(r);
	}
	main().catch(console.error);
</script>
