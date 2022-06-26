<script context="module" lang="ts">
	import type { Load } from './__types/index';

	export const load: Load = async ({ params }) => {
		return {
			props: {
				username: params.username
			}
		};
	};
</script>

<script lang="ts">
	export let username: string;
</script>

<h1>{username}</h1>
