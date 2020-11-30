<script>
	import { getId } from '../../utils/component.js'

	export let id
	export let placeholder
	export let value
	export let label
	export let required = false
	export let rows = 5

	const _id = getId()
</script>

<div>
	{#if label}
		<label for={_id}>{label}</label>
	{/if}

	<textarea 
		id={_id}
		type="text"
		name={id}
		{placeholder}
		{required}
		{rows}
		bind:value={value}/>
</div>