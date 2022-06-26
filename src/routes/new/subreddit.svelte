<script lang="ts">
	import { browser } from '$app/env';

	import type { subreddit_post_req_data } from './subreddit';

	const data: subreddit_post_req_data = {
		name: '',
		desc: '',
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
		const res = await fetch('./subreddit', {
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

<input type="text" bind:value={data.name} placeholder="name" />
<input type="text" bind:value={data.desc} placeholder="desciption" />
<button on:click={submit}>Submit</button>
