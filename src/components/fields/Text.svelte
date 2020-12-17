<!-- 
	doc: https://sveltematerialui.com/demo/textfield 
	doc: https://github.com/hperrin/svelte-material-ui/blob/master/site/src/routes/demo/textfield.svelte
-->

<script>
	export let id
	export let value=''
	export let label
	export let required = false
	export let variant // 'underlined' (default), 'outlined', 'filled'
	export let dense = false 
	export let primary = defaultTheme.palette.primary.main
	export let padding = 10
	
	import Textfield from '@smui/textfield'
	import { css } from '@emotion/css/dist/emotion-css.umd.min.js'
	import defaultTheme from '../../theme/defaultTheme.js'
	import { getId } from '../../utils/component.js'
	import { TinyColor } from '../../utils/tinyColor'
	import { cardinalParse } from '../../utils/converter.js'

	variant = variant == 'underlined' ? undefined : variant
	const labelColor = TinyColor(primary).setAlpha(0.87).toRgbString()

	const cssPadding = cardinalParse(padding)

	let root = css`
		--mdc-theme-primary: ${primary};
		padding-top: ${cssPadding.top};
		padding-bottom: ${cssPadding.bottom};
		padding-right: ${cssPadding.right};
		padding-left: ${cssPadding.left};

		& .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
			color: ${labelColor};
		}
	`

	const _id = getId()
</script>


<div class="{root}">
	<Textfield
		id={_id}
		bind:value={value}
		label={label}
		input$name={id}
		input$aria-controls="helper-text-standard-a"
		input$aria-describedby="helper-text-standard-a"/>
</div>