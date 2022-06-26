<script lang="ts">
	import type { user_post_req_data } from './user';

	const user_data: user_post_req_data = {
		name: '',
		uname: '',
		desc: '',
		nacked_pwd: ''
	};

	const submit = async () => {
		const res = await fetch('./user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify(user_data)
		});
		if (res.status !== 200) {
			return;
		}
		const jsn = await res.json();
		window.localStorage.setItem('sessionTocken', jsn.sessionTocken);
		console.log('success');
	};
</script>

<input bind:value={user_data.name} class="p-5" type="text" placeholder="display name" />
<input bind:value={user_data.uname} class="p-5" type="text" placeholder="username" />
<textarea bind:value={user_data.desc} class="p-5" cols="30" rows="10" placeholder="Description" />
<input bind:value={user_data.nacked_pwd} class="p-5" type="password" placeholder="password" />
<button on:click={submit} class="p-5">Submit</button>
