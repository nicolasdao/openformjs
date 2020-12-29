<script>
	export let fields = []

	// import { onMount, afterUpdate } from 'svelte'

	// let fieldsReadyForUpdate = false
	// let counter = 0
	// let backedUpFields

	// $: {
	// 	if (fieldsReadyForUpdate) {
	// 		console.log('SOMETHING CHANGED')
	// 		console.log(counter)
	// 		counter++
	// 		backedUpFields = [...(fields||[])]
	// 		fields = []
	// 		fieldsReadyForUpdate = false
	// 	} else 
	// 		fieldsReadyForUpdate = true
	// }

	// afterUpdate(() => {
	// 	if (!fieldsReadyForUpdate && backedUpFields) {
	// 		console.log('hard fields re-render')
	// 		// fields = [...backedUpFields]
	// 		backedUpFields = null
	// 		fieldsReadyForUpdate = true
	// 		console.log(fields)
	// 	}
	// })
</script>

<form>
	{#each fields as field}
		<svelte:component this={field.component} {...field}/>
	{/each}
</form>