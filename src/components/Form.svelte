<script>
	export let fields = []
</script>

<form>
	{#each fields as field}
		<svelte:component this={field.component} {...field}/>
	{/each}
</form>