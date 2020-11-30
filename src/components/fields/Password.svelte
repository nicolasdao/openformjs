<script>
	import { getId } from '../../utils/component.js'

	export let id
	export let placeholder
	export let value
	export let label
	export let required = false

	const _id = getId()
</script>

<div>
	{#if label}
		<label for={_id}>{label}</label>
	{/if}

	<input 
		id={_id}
		type="password"
		name={id}
		{placeholder}
		{required}
		bind:value={value}>
</div>