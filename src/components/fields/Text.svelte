<!-- 
	doc: https://sveltematerialui.com/demo/textfield 
	doc: https://github.com/hperrin/svelte-material-ui/blob/master/site/src/routes/demo/textfield.svelte
-->

<script>
	export let id
	export let value=''
	export let label='hello'
	export let required = false
	export let variant // 'underlined' (default), 'outlined', 'filled'
	export let dense = false 
	export let style = {}
	
	import Textfield from '@smui/textfield'
	import { css } from '@emotion/css/dist/emotion-css.umd.min.js'
	import defaultTheme from '../../theme/defaultTheme.js'
	import { getId } from '../../utils/component.js'
	import { TinyColor } from '../../utils/tinyColor'

	variant = variant == 'underlined' ? undefined : variant
	style.palette = style.palette||{}
	const primary = style.palette.primary||defaultTheme.palette.primary.main
	const labelColor = TinyColor(primary).setAlpha(0.87).toRgbString()

	let root = css`
		--mdc-theme-primary: ${primary};
		padding-top: ${style.paddingTop || style.padding || 10}px;
		padding-bottom: ${style.paddingBottom || style.padding || 10}px;
		padding-right: ${style.paddingRight || style.padding || 10}px;
		padding-left: ${style.paddingLeft || style.padding || 10}px;

		& .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
			color: ${labelColor};
		}
	`

	const _id = getId()
</script>


<div class="{root}">
	<!-- {#if label}
		<label for={_id}>{label}</label>
	{/if}

	<input 
		id={_id}
		type="text"
		name={id}
		{placeholder}
		{required}
		bind:value={value}> -->
	<Textfield
		id={_id}
		bind:value={value}
		label={label}
		{variant}
		dense={dense || undefined}
		input$aria-controls="helper-text-standard-a"
		input$aria-describedby="helper-text-standard-a"/>
</div>