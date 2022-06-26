<script lang="ts">
	import { browser } from '$app/env';
	import type { vote_post_req_data } from 'src/routes/api/vote';
	import type { get_query_posts } from 'src/routes/r/[subreddit]/[filter]';

	export let post: get_query_posts;
	let cantvote = true;

	const data: vote_post_req_data = {
		vote: 1,
		post_uuid: post.uuid,
		sessionTocken: ''
	};

	if (browser) {
		const sessionTocken = window.localStorage.getItem('sessionTocken');
		if (sessionTocken) {
			cantvote = false;
			data.sessionTocken = sessionTocken;
		}
	}

	const vote = (vote: number) => {
		data.vote = vote;
		fetch('/api/vote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	};
</script>

<a
	href="./{post.uuid}"
	title={post.title}
	class="flex items-center border border-color-gray hover:border-color-black transition-duration-0.1s hover:-translate-x-.5rem rounded-1rem"
>
	<div class="flex items-center justify-center h-full border-r border-color-gray">
		<div class="text-center">
			<button
				disabled={cantvote}
				on:click|preventDefault={() => vote(2)}
				class="text-xl m-3 block i-bx-upvote hover:i-bx-bxs-upvote"
			/>
			<span>{post.ups - post.downs}</span>
			<button
				on:click|preventDefault={() => vote(0)}
				class="text-xl m-3 block i-bx-downvote hover:i-bx-bxs-downvote"
			/>
		</div>
	</div>
	<span class="row-span-8 p-3">
		<h3>{post.title}</h3>
		<p>{post.content}</p>
	</span>
</a>
