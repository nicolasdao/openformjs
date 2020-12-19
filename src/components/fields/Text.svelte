<!-- 
	doc examples: https://sveltematerialui.com/demo/textfield 
	doc code: https://github.com/hperrin/svelte-material-ui/blob/master/site/src/routes/demo/textfield.svelte
	design theory: https://material.io/components/text-fields
-->

<script>
	// Meta
	export let id = ''
	// Content
	export let label
	export let placeholder
	export let value = ''
	export let type = 'text' // 'text', 'textarea', 'number', 'date', 'password', 'email'
	export let helperText = ''
	export let leadingIcon // all icon's name at https://material.io/resources/icons/?style=baseline
	export let trailingIcon // all icon's name at https://material.io/resources/icons/?style=baseline
	// Style
	export let variant = 'underlined' // 'underlined' (default), 'outlined', 'filled'
	export let dense = false 
	export let primary = defaultTheme.palette.primary.main
	export let error = defaultTheme.palette.error.main
	export let width // Can number (unit px) or string. If string, then this is CSS (e.g., '100%', 'calc(100% - 12px)')
	export let padding = 10
	export let helperTextAlwaysOn
	export let borders
	// Behavior
	export let maxChar
	export let invalid = false
	export let step = 1
	export let passwordViewable = false // When true, a trailing eye icon allows the user to switch hidden/visible password
	
	import Textfield from '@smui/textfield'
	import HelperText from '@smui/textfield/helper-text/index'
	import Icon from '@smui/textfield/icon/index'
	import CharacterCounter from '@smui/textfield/character-counter/index'
	import { css } from '@emotion/css/dist/emotion-css.umd.min.js'
	import defaultTheme from '../../theme/defaultTheme.js'
	import { getId } from '../../utils/component.js'
	import TinyColor from '../../utils/tinyColor'
	import { cardinalParse, iconToMaterial } from '../../utils/converter.js'

	const DEFAULT_MATERIAL_ICON_CLASS = 'material-icons-outlined'
	const _id = getId()
	const description = `text-field-${_id}`
	const showMaxChar = maxChar !== undefined && maxChar !== null && maxChar > 0
	const showHelperTextOnly = helperText && !showMaxChar
	const showPasswordVisibilityIcon = type == 'password' && passwordViewable
	let fieldType = !type || type == 'text' ? undefined : type == 'date' ? 'datetime-local' : type
	const labelColor = TinyColor(primary).setAlpha(0.87).toRgbString()
	const cssPadding = cardinalParse(padding)
	const rootClass = css`
		--mdc-theme-primary: ${primary};
		--mdc-theme-error: ${error};
		& .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
			color: ${labelColor};
		}

		padding-top: ${cssPadding.top};
		padding-bottom: ${cssPadding.bottom};
		padding-right: ${cssPadding.right};
		padding-left: ${cssPadding.left};
	`

	const getBorders = (border, variant) => {
		if (border === undefined || border === null)
			return ''
		else if (variant == 'filled')
			return css`
				& label.mdc-text-field {
					border-radius: ${border}px ${border}px 0px 0px;
				}
			`
		else
			return ''
	}

	const getWidth = width => {
		if (!width)
			return ''
		const t = typeof(width)
		if (t == 'number')
			return css`
				width: ${width}px;
				& label.mdc-text-field {
					width: ${width}px;
				}
			`
		else if (t == 'string')
			return css`
				width: ${width};
				& label.mdc-text-field {
					width: ${width};
				}
			`
		else
			return ''
	}

	const getCorrectTrailingIcon = icon => {
		const trailingMDIcon = iconToMaterial(icon)
		if (showPasswordVisibilityIcon)
			return { icon: 'visibility', class: trailingMDIcon ? trailingMDIcon.class : DEFAULT_MATERIAL_ICON_CLASS }
		else
			return trailingMDIcon
	}

	const bordersClass = getBorders(borders, variant)
	const widthClass = getWidth(width)
	const leadingMDIcon = iconToMaterial(leadingIcon)
	let trailingMDIcon = getCorrectTrailingIcon(trailingIcon)

	const changePasswordDisplay = () => {
		if (type != 'password')
			return

		if (fieldType == 'password') {
			trailingMDIcon = { ...trailingMDIcon, icon:'visibility_off' }
			fieldType = 'text'
		} else {
			trailingMDIcon = { ...trailingMDIcon, icon:'visibility' }
			fieldType = 'password'
		}
	}

</script>

<div class="{rootClass} {bordersClass} {widthClass}">
	<Textfield
		id={_id}
		bind:value={value}
		class="shaped"
		label={label}
		invalid={invalid || undefined}
		variant={variant == 'underlined' ? undefined : variant}
		dense={dense}
		type={fieldType}
		withLeadingIcon={leadingIcon ? true : undefined}
		withTrailingIcon={trailingIcon ? true : undefined}
		input$name={id}
		input$placeholder={placeholder || undefined}
		input$maxlength={showMaxChar ? maxChar : undefined}
		input$step={type == 'number' ? step : undefined}
		input$aria-controls={description}
		input$aria-describedby={description}>
		{#if leadingMDIcon}
			<div>
				<Icon class="{leadingMDIcon.class}">{leadingMDIcon.icon}</Icon>
			</div>
		{/if}

		{#if showPasswordVisibilityIcon}
			<div on:click={changePasswordDisplay}>
				<div class="password-switch"></div>
				<Icon class="{trailingMDIcon.class}">{trailingMDIcon.icon}</Icon>
			</div>
		{:else if trailingMDIcon}
			<Icon class="{trailingMDIcon.class}">{trailingMDIcon.icon}</Icon>
		{/if}
	</Textfield>
	{#if showHelperTextOnly}
		<HelperText id={description} persistent={helperTextAlwaysOn ? true : undefined}>{helperText||''}</HelperText>
	{:else if showMaxChar}
		<HelperText id={description} persistent={helperTextAlwaysOn ? true : undefined}>
			{helperText||''}
			<span slot="character-counter"><CharacterCounter>0 / {maxChar}</CharacterCounter></span>
		</HelperText>
	{/if}
</div>

<style>
	.password-switch {
		width: 26px;
		height: 100%;
		left: auto;
		right: 0;
		position: absolute;
		cursor: pointer;
	}
</style>



