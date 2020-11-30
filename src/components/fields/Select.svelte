<script>
	import { getId } from '../../utils/component.js'

	export let id
	export let placeholder
	export let value = placeholder
	export let label
	export let required = false
	export let values = []

	const _id = getId()
</script>

<div>
	{#if label}
		<label for={_id}>{label}</label>
	{/if}

	<select 
		id={_id}
		name={id}
		{required}
		value={value}>

		{#if placeholder}
			<option disabled value={value}>{placeholder}</option>
		{/if}

		{#each values as option}
			<option
				value={option.id||option.value||option}
			>{option.value||option}</option>
		{/each}

	</select>
</div>