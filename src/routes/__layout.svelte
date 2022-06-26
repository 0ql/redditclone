<script lang="ts">
	import Navbar from 'src/components/navbar.svelte';
	import 'uno.css';
</script>

<Navbar />
<main class="m-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
	<slot />
</main>

<style global>
	@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
	* {
		text-decoration: none;
		margin: 0px;
		padding: 0px;
		border: none;
		background: none;
		box-sizing: border-box;
		color: currentColor;
		font-family: 'Poppins', sans-serif;
	}
	a,
	button,
	input,
	select,
	textarea {
		cursor: pointer;
		border: 1px solid gray;
		border-radius: 1rem;
	}
	a:hover,
	button:hover,
	input:hover,
	select:hover,
	textarea:hover {
		border-color: black;
	}
</style>
