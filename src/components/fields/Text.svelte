<!-- 
	doc examples: https://sveltematerialui.com/demo/textfield 
	doc code: https://github.com/hperrin/svelte-material-ui/blob/master/site/src/routes/demo/textfield.svelte
	design theory: https://material.io/components/text-fields

	Usefull info:
	- Default height: 56px
	- Default font-size: 1rem
	- Default label font-size: 1rem
	- Dense height: 48px
-->

<script>
	const DEFAULT_MATERIAL_ICON_CLASS = 'material-icons-outlined'
	const DEFAULT_HEIGHT = 56
	const LABEL_BOTTOM_POS_OFFSET = 18

	/* 
	=======================================================
	START - PROPERTIES
	=======================================================
	*/
	// Meta
	export let id = ''
	// Content
	export let label = null
	export let placeholder = null
	export let value = ''
	export let type = 'text' // 'text', 'textarea', 'number', 'date', 'datetime' (this includes hours), 'password', 'email'
	export let helperText = '' // This can also be an array, in which case each item represents a new line
	export let leadingIcon = null // all icon's name at https://material.io/resources/icons/?style=baseline
	export let trailingIcon = null // all icon's name at https://material.io/resources/icons/?style=baseline
	// Style
	export let variant = 'underlined' // 'underlined' (default), 'outlined', 'filled'
	export let dense = false 
	export let primary = defaultTheme.palette.primary.main
	export let error = defaultTheme.palette.error.main
	export let width = null // Can number (unit px) or string. If string, then this is CSS (e.g., '100%', 'calc(100% - 12px)')
	export let height = DEFAULT_HEIGHT
	export let padding = 10
	export let helperTextAlwaysOn
	export let borders = null
	export let fontScale = 1
	export let labelTopPos = 0
	export let labelBottomPos = 0
	export let helperTextListStyle = 'none' // CSS value for the 'list-style-type' property. Valid values: 'disc' (aka bullet), 'circle', 'none', 'decimal', 'square', 'lower-latin' (e.g., 'a', 'b'), 'lower-roman' (e.g., 'i', 'ii')
	// Behavior
	export let maxChar = null
	export let invalid = false
	export let step = 1
	export let passwordViewable = false // When true, a trailing eye icon allows the user to switch hidden/visible password
	
	/* 
	=======================================================
	END - PROPERTIES
	=======================================================
	*/
	
	import { onMount } from 'svelte'
	import Textfield from '@smui/textfield'
	import HelperText from '@smui/textfield/helper-text/index'
	import Icon from '@smui/textfield/icon/index'
	import CharacterCounter from '@smui/textfield/character-counter/index'
	import { css } from '@emotion/css/dist/emotion-css.umd.min.js'
	import defaultTheme from '../../theme/defaultTheme.js'
	import { getId } from '../../utils/component.js'
	import TinyColor from '../../utils/tinyColor'
	import { paddingParse, iconToMaterial, cornerParse } from '../../utils/converter.js'

	const _id = getId()
	// Quadratic and linear equations' parameters found with tool at https://www.dcode.fr/function-equation-finder
	// const labelOutlinedTopPos = Math.round((0.496847*height)-10.0876)
	// const labelTopPos = Math.round((0.487637*height)-8.51976)
	// const labelOutlinedYtranslatePerc = Math.round((-0.00130053*height*height) - (2.57357*height) + 4.22145)
	const labelSizeFactor = fontScale <= 1  ? 1 : fontScale > 4 ? 0.6 : -0.0413257*fontScale*fontScale-0.00337725*fontScale+1.03947
	const labelDenseScale = (dense ? 0.8 : 0.75)*labelSizeFactor
	const description = `text-field-${_id}`
	const showMaxChar = maxChar !== undefined && maxChar !== null && maxChar > 0
	const showHelperTextOnly = helperText && !showMaxChar
	let fieldType = !type || type == 'text' ? undefined : type == 'datetime' ? 'datetime-local' : type
	const labelColor = TinyColor(primary).setAlpha(0.87).toRgbString()
	const cssPadding = paddingParse(padding)

	const setOutlinedLabelWidth = () => {
		if (variant != 'outlined' || fontScale <= 1)
			return

		const labelEl = document.querySelector(`#${_id} .mdc-notched-outline__notch span`)
		if (!labelEl)
			return

		const width = Math.round(labelEl.offsetWidth * labelDenseScale * fontScale + 8)
		labelEl.parentElement.classList.add(css`width: ${width}px !important;`)
	}

	const getBorders = (borders, variant) => {
		if (borders === undefined || borders === null)
			return ''

		const { topLeft, topRight, bottomLeft, bottomRight } = cornerParse(borders)
		if (variant == 'filled')
			return `
				& label.mdc-text-field {
					border-radius: ${topLeft}px ${topRight}px 0px 0px;
				}
			`
		else if (variant == 'outlined') {
			const customLeadingWidth = (topLeft && topLeft > 12) || (bottomLeft && bottomLeft > 12)
				? (topLeft || 0) > (bottomLeft || 0) ? topLeft : bottomLeft
				: null
			return `
				& .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
					border-radius: ${topLeft}px 0px 0px ${bottomLeft}px;
					${customLeadingWidth ? `width: ${customLeadingWidth}px` : '' }
				}

				& .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {
					border-radius: 0px ${topRight}px ${bottomRight}px 0px;
				}
			`
		} else
			return ''
	}

	const getWidth = width => {
		if (!width)
			return ''
		const t = typeof(width)
		if (t == 'number')
			return `
				width: ${width}px;
				& label.mdc-text-field {
					width: ${width}px;
				}
			`
		else if (t == 'string')
			return `
				width: ${width};
				& label.mdc-text-field {
					width: ${width};
				}
			`
		else
			return ''
	}

	const showPasswordVisibilityIcon = type == 'password' && passwordViewable
	const getCorrectTrailingIcon = icon => {
		const trailingMDIcon = iconToMaterial(icon)
		if (showPasswordVisibilityIcon)
			return { icon: 'visibility', class: trailingMDIcon ? trailingMDIcon.class : DEFAULT_MATERIAL_ICON_CLASS }
		else
			return trailingMDIcon
	}

	const themeStyle = `
		--mdc-theme-primary: ${primary};
		--mdc-theme-error: ${error};
		& .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
			color: ${labelColor};
		}
	`

	const fontStyle = fontScale == 1 ? '' : `
		& input {
			font-size: ${fontScale}rem;
		}
	`
	
	const heightStyle = `
		& label.mdc-text-field {
			height: ${height}px;
		}
	`

	const translateYOffset = variant == 'outlined' ? (dense ? 24 : 27) : (dense ? 13 : 10)
	const textStyle = `
		& .mdc-floating-label {
			top: ${LABEL_BOTTOM_POS_OFFSET - labelBottomPos}px;
			${fontScale == 1 ? '' : `transform: scale(${fontScale});`}
		}

		& .mdc-floating-label.mdc-floating-label--float-above {
			transform: translateY(-${translateYOffset+labelTopPos}px) scale(${labelDenseScale*fontScale}) !important;
		}
	`

	const paddingStyle = `
		padding-top: ${cssPadding.top}px;
		padding-bottom: ${cssPadding.bottom}px;
		padding-right: ${cssPadding.right}px;
		padding-left: ${cssPadding.left}px;
	`

	const passwordSwitchClass = css`
		width: ${variant == 'outlined' ? 48 : 26}px;
		height: 100%;
		left: auto;
		right: 0;
		position: absolute;
		cursor: pointer;
		z-index: 10;
	`

	const helperTextClass = css`
		margin: 0px;
		padding-left: ${helperTextListStyle == 'none' ? '0px' : '1.2em'};
		margin-top: -1.2em;
		list-style-type: ${helperTextListStyle};
	`

	const helperHtmlText = helperText && Array.isArray(helperText) 
		? helperText.length ? `<ul class=${helperTextClass}>${helperText.map(t => `<li>${t}</li>`).join('')}</ul>` : ''
		: helperText

	const bordersStyle = getBorders(borders, variant)
	const widthStyle = getWidth(width)
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

	const rootClass = css`
		${themeStyle}
		${textStyle}
		${fontStyle}
		${paddingStyle}
		${bordersStyle}
		${widthStyle}
		${heightStyle}
	`

	onMount(() => {
		setOutlinedLabelWidth()
	})

</script>

<div class="{rootClass}">
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
				<div class="{passwordSwitchClass}"></div>
				<Icon class="{trailingMDIcon.class}">{trailingMDIcon.icon}</Icon>
			</div>
		{:else if trailingMDIcon}
			<Icon class="{trailingMDIcon.class}">{trailingMDIcon.icon}</Icon>
		{/if}
	</Textfield>
	{#if showHelperTextOnly}
		<HelperText id={description} persistent={helperTextAlwaysOn ? true : undefined}>{@html helperHtmlText||''}</HelperText>
	{:else if showMaxChar}
		<HelperText id={description} persistent={helperTextAlwaysOn ? true : undefined}>
			{@html helperHtmlText||''}
			<span slot="character-counter"><CharacterCounter>0 / {maxChar}</CharacterCounter></span>
		</HelperText>
	{/if}
</div>



