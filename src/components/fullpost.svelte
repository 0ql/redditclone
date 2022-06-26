<script lang="ts">
	import type { get_query_posts } from 'src/routes/r/[subreddit]/[filter]';

	export let post: get_query_posts;
</script>

<section class="col-span-full row-span-full">
	<h1>{post.title}</h1>
	<p>
		{post.content}
	</p>
</section>
