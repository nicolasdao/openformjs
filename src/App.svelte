<script>
	import defaultField from './components/fields/index.js'
	import Form from  './components/Form.svelte'
	import { getId } from './utils/component.js'
	import { version } from '../package.json'

	export let forms
	export let plugins = []

	const id = getId()

	/**
	 * Gets the form fiels with using the correct plugin. 
	 * 
	 * @param  {String} form.fields[].id			e.g., 'first_name'
	 * @param  {String} form.fields[].type			e.g., 'text', 'email', 'button'
	 * @param  {String} form.fields[].label			e.g., 'First name'
	 * @param  {String} form.fields[].placeholder	e.g., 'Enter your first name',
	 * @param  {Style}  form.fields[].style			
	 * @param  {String} form.fields[].plugin		default is null which means raw HTML with no CSS. Popular plugin: 'bootstrap5'
	 * 
	 * @return {String} componentFields[].id			
	 * @return {String} componentFields[].type			
	 * @return {String} componentFields[].label			
	 * @return {String} componentFields[].placeholder	
	 * @return {Style}  componentFields[].style			
	 * @return {String} componentFields[].plugin		
	 * @return {Object} componentFields[].component		
	 */
	const getComponentFields = form => {
		if (!form || !form.fields || !form.fields.length)
			return []

		const componentFields = []
		for (let field of form.fields) {

			if (!field.id)
				throw new Error('Invalid field. Missing required \'id\' property.')
			if (!field.type)
				throw new Error('Invalid field. Missing required \'type\' property.')

			const Plugin = field.plugin ? plugins.find(x => x.name == field.plugin) : defaultField
			if (!Plugin)
				throw new Error(`Invalid Field ID ${field.id}. Plugin ${field.plugin} not found.`)

			const fieldType = field.type.replace(/^./, m => m.toUpperCase())
			if (!Plugin[fieldType])
				throw new Error(`Invalid Field ID ${field.id}. Definition for field type '${fieldType}' not found in Plugin ${field.plugin}.`)

			field.component = Plugin[fieldType]
			componentFields.push(field)
		}

		return componentFields

	}

</script>

<div {id} data-widget="formjs" data-version={version}>
	{#each forms as form}
		<Form class="hello-nic" fields={getComponentFields(form)}></Form>
	{/each}
</div>

<style type="text/scss">
	.hello-nic {
		padding: 0px;
	}
</style>