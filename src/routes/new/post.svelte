<script lang="ts">
	import { browser } from '$app/env';
	import type { post_post_req_data } from './post';
	const data: post_post_req_data = {
		title: '',
		type: 0,
		content: '',
		subredditname: '',
		sessionTocken: ''
	};

	if (browser) {
		const sessionTocken = window.localStorage.getItem('sessionTocken');
		if (!sessionTocken) {
			window.location.href = '/login';
		} else {
			data.sessionTocken = sessionTocken;
		}
	}

	const submit = async () => {
		const res = await fetch('./post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (res.status !== 200) {
			return;
		}
		console.log('success');
	};
</script>

<input bind:value={data.title} class="p-5" type="text" placeholder="title" />
<select bind:value={data.type} class="p-5">
	<option value="0">Text Post</option>
</select>
<textarea bind:value={data.content} class="p-5" cols="30" rows="10" placeholder="content" />
<input bind:value={data.subredditname} class="p-5" type="text" placeholder="Subreddit" />
<button class="p-5" on:click={submit}>Submit</button>
