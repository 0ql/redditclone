<script lang="ts">
	import Fullpost from 'src/components/fullpost.svelte';
	import Previewpost from 'src/components/previewpost.svelte';
	import type { get_subreddit_data, get_query_posts } from '.';

	export let postonly: boolean;
	export let post: get_query_posts;
	export let get_subreddit_data: get_subreddit_data;
	export let get_query_posts: get_query_posts[];
</script>

{#if !postonly}
	<header class="col-span-full">
		<h1>r/{get_subreddit_data.name}</h1>
		<p>{get_subreddit_data.desc}</p>
	</header>
	{#each get_query_posts as post}
		<Previewpost {post} />
	{/each}
	{#if get_query_posts.length >= 10}
		<a
			class="border border-gray p-5 rounded-1rem"
			href="?after={get_query_posts[get_query_posts.length - 1].uuid}">next page</a
		>
	{/if}
{:else}
	<Fullpost {post} />
{/if}
