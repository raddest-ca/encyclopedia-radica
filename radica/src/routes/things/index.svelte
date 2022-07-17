<script lang="ts">
	import { _ } from "svelte-i18n";
</script>

<div class="content m-2">
	<div class="flex flex-wrap">
		<a href="things/type">
			<div
				class="card transition-all card-side h-48 w-96 bg-base-100 shadow-xl border-primary border-2 m-2 image-full"
			>
				<figure>
					<img src="/things/card-memes.png" alt="demon core meme" />
				</figure>
				<div class="card-body">
					<h2 class="card-title shadow-xl rounded-md text-primary-content p-2 text-4xl bg-primary">
						{$_("route.things.index.card.memes.header")}
					</h2>
				</div>
			</div>
		</a>
		<a href="things/type">
			<div
				class="card transition-all card-side h-48 w-96 bg-base-100 shadow-xl border-primary border-2 m-2 image-full"
			>
				<figure><img src="/things/card-types.png" alt="ai art" /></figure>
				<div class="card-body">
					<h2 class="card-title shadow-xl rounded-md text-primary-content p-2 text-4xl bg-primary">
						{$_("route.things.index.card.types.header")}
					</h2>
				</div>
			</div>
		</a>
	</div>
</div>

<style>
	img {
		transform: scale(1.1);
	}
	.card.image-full::before {
		opacity: 0;
	}
	.card:hover {
		transform: translateY(-10px);
	}
</style>
