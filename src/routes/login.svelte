<script lang="ts">
	import type { login_post_req_data } from './login';

	const data: login_post_req_data = {
		uname: '',
		nacked_pwd: ''
	};

	const submit = async () => {
		const res = await fetch('.', {
			method: 'POST',
			body: JSON.stringify(data)
		});

		console.log(res.status);
	};
</script>

<input
	bind:value={data.uname}
	type="text"
	title="enter password"
	placeholder="username"
	class="p-5"
/>
<input
	bind:value={data.nacked_pwd}
	type="password"
	title="enter password"
	placeholder="password"
	class="p-5"
/>
<button title="create new user" class="p-5" on:click={submit}>Submit</button>
