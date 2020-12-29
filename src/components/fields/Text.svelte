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
	const DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH = 12 // That's the block that contains the top-left and bottom-left rounded corners.

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
	export let type = 'text' // 'text', 'textarea', 'number', 'date', 'datetime' (this includes hours), 'password', 'email', 'file'
	export let helperText = '' // This can also be an array, in which case each item represents a new line
	export let leadingIcon = null // all icon's name at https://material.io/resources/icons/?style=baseline
	export let trailingIcon = null // all icon's name at https://material.io/resources/icons/?style=baseline
	// Style
	export let variant = 'underlined' // 'underlined' (default), 'outlined', 'filled'
	export let labelUp = false
	export let dense = false 
	export let primary = defaultTheme.palette.primary.main
	export let error = defaultTheme.palette.error.main
	export let width = null // Can number (unit px) or string. If string, then this is CSS (e.g., '100%', 'calc(100% - 12px)')
	export let height = DEFAULT_HEIGHT
	export let padding = 10
	export let helperTextAlwaysOn
	export let borders = null
	export let fontScale = 1
	export let fontFamily = ''
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
	// import { css } from '@emotion/css/dist/emotion-css.umd.min.js'
	import { css } from '@emotion/css/dist/emotion-css.esm.js'
	import defaultTheme from '../../theme/defaultTheme.js'
	import { getId } from '../../utils/component.js'
	import TinyColor from '../../utils/tinyColor'
	import { paddingParse, iconToMaterial, cornerParse } from '../../utils/converter.js'

	// CONSTANTS
	const _id = getId()
	const description = `text-field-${_id}`
	const state = {}
	let node
	
	/* 
	=======================================================
	START - FUNCTIONS
	=======================================================
	*/

	const transformLabelToTopLeft = (x, scale, notImportant) => 
		`transform: ${x === undefined || x === null ? '' : `translateX(${x}%)`} translateY(-57%) scale(${scale}) ${notImportant ? '' : '!important' };`

	// Creates the CSS style to resize the label when the text field is not outlined and the font is not the default. 
	const setLabelUpStyle = (labelUp, node, labelDenseScale) => {
		if (!labelUp || !node)
			return 

		const labelEl = node.querySelector('span.mdc-floating-label')
		if (!labelEl)
			return


		labelEl.classList.add(css(transformLabelToTopLeft(null, labelDenseScale)))
	}

	// Makes the original input invisible and overlay a new text
	const setInputFile = ({ type, node, isOutlined, isUnderlined, leadingIcon, fontScale, placeholder }) => {
		if (type != 'file' || !node)
			return

		const rootEl = node.querySelector('label.mdc-text-field')
		if (!rootEl)
			return
		const inputEl = rootEl.querySelector('input')
		if (!inputEl)
			return

		inputEl.style.cursor = 'pointer'
		const div = new DOMParser().parseFromString(`
			<div class="fake-mdc-text-field__input" style="
				position: absolute;
				height: 100%;
				width: 100%;
				${isOutlined ? '' : 'border-bottom: 1px solid rgba(0,0,0,.42);'}
				display: flex;
				align-items: center;
			">
				<span class="file-name" style="
					padding-left: ${isUnderlined || leadingIcon ? 0 : 16}px;
					padding-top: ${isOutlined ? 0 : 14}px;
					font-smooth: auto;
					-moz-osx-font-smoothing: grayscale;
					-webkit-font-smoothing: antialiased;
					color: #757575;
					font-size: ${fontScale}em !important;
					text-overflow: ellipsis;
					overflow: hidden;
				">
					${placeholder||''}
				</span>
			</div>
		`, 'text/html')
		
		rootEl.insertBefore(div.body.firstChild, inputEl)
	}

	const getFieldType = ({ type, isOutlined, isDate }) => isOutlined
		? (!type || type == 'text' || isDate ? undefined : type)
		: (!type || type == 'text' ? undefined : type == 'datetime' ? 'datetime-local' : type)

	const updateFile = ({file, placeholder, type, node}) => {
		if (type != 'file' || !node)
			return 

		const fileNameEl = node.querySelector('span.file-name')
		if (!fileNameEl)
			return 

		if (file) {
			fileNameEl.style.color = 'rgba(0,0,0,.87)'
			fileNameEl.innerHTML = file.split(/[\\/]/).slice(-1)[0]
		} else if (placeholder) {
			fileNameEl.style.color = '#757575'
			fileNameEl.innerHTML = placeholder
		}
	}

	// Creates the CSS style to dynamically animate the label when the text field is outlined. 
	const setOutlinedLabelStyle = ({id, node, labelDenseScale, isDate, labelUp}) => {
		if (!node)
			return

		// 1. Confirm the DOM is there
		const mainBox = node.querySelector(`#${id}`)
		if (!mainBox)
			return

		const labelContainer = mainBox.querySelector('.mdc-notched-outline__notch')
		if (!labelContainer)
			return labelContainer

		const labelEl = labelContainer.querySelector('span')
		if (!labelEl)
			return 

		// 2. Gets the current position of the label and the text field top line + calculate the distances 
		// to translate the label from its current position to the top left corner of the text field.
		const labelRect = labelEl.getBoundingClientRect()
		const labelBottomPos = labelRect.bottom 
		const labelLineHeightOffset = labelRect.height * 0.2	// That's because the label's dimensions are coming from
		// its line-height, which is 120% bigger than the actual font.
		const labelReducedSizeOffset = labelRect.height*(1-labelDenseScale)
		const mainBoxTopPos = mainBox.getBoundingClientRect().top
		const labelStartPos = labelContainer.getBoundingClientRect().left 

		const distanceFromTop = labelBottomPos - mainBoxTopPos - labelLineHeightOffset - labelReducedSizeOffset
		const distanceFromStart = labelRect.left - labelStartPos - 4

		// 3. Apply the CSS style
		const width = Math.ceil(labelEl.offsetWidth*labelDenseScale + 8)

		const labelOutlinedTopLeftTransform = `transform: ${distanceFromStart > 15 ? `translateX(-${distanceFromStart}px)` : '' } translateY(-${distanceFromTop}px) scale(${labelDenseScale}) !important;`

		labelEl.parentElement.parentElement.classList.add(css`
			&.mdc-notched-outline--notched .mdc-notched-outline__notch {
				width: ${width}px !important;
			}
		`)
		labelEl.parentElement.classList.add(css`
			& .mdc-floating-label--float-above {
				max-width: unset !important;
				min-width: ${labelEl.offsetWidth}px !important;
				${labelOutlinedTopLeftTransform}
			}
		`)

		// If this is a date, then position the label to the top left.
		if (isDate) {
			labelEl.parentElement.parentElement.classList.add('mdc-notched-outline--notched')
			labelEl.classList.add('mdc-floating-label--float-above')
		} else if (labelUp) {
			labelEl.parentElement.classList.add(css`
				padding-left: 0;
				border-top: none;
			`)
			labelEl.classList.add(css(`
				max-width: unset !important;
				min-width: 38px !important;
				${labelOutlinedTopLeftTransform}
			`))
		}
	}

	// This hack is needed for outlined text field so the label position can be calculated before the value
	// is set. Indeed, when the value is set, the label moves.
	const setOutlinedValue = (state, val) => state.explicitValue = val

	// This hack is needed for outlined date field so the label position can be calculated before the value
	// is set. Indeed, when the value is set, the label moves.
	const setOutlinedDateFieldType = (state, type) => {
		if (type == 'datetime')
			state.fieldType = 'datetime-local'
		else if (type == 'date')
			state.fieldType = 'date'
	}

	const getOutlinedLeadingBlockWidth = borders => {
		if (!borders)
			return DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH

		const { topLeft, bottomLeft } = cornerParse(borders)

		const value = (topLeft && topLeft > DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH) || (bottomLeft && bottomLeft > DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH)
			? (topLeft || 0) > (bottomLeft || 0) ? topLeft : bottomLeft
			: DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH

		return Math.round(value > height/2 ? height/2 : value)
	}

	const getBorders = ({borders, isFilled, isOutlined}) => {
		if (borders === undefined || borders === null)
			return ''

		const { topLeft, topRight, bottomLeft, bottomRight } = cornerParse(borders)
		if (isFilled)
			return `
				& label.mdc-text-field {
					border-radius: ${topLeft}px ${topRight}px 0px 0px;
				}
			`
		else if (isOutlined) {
			const outlinedLeadingBlockWidth = getOutlinedLeadingBlockWidth(borders)
			
			const customLeftPaddingInput = 16 + outlinedLeadingBlockWidth - DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH // 16 is the original LP, 12 is the original leading width
			return `
				& .mdc-text-field--outlined {
					& .mdc-text-field__input {
						padding: 12px 16px 14px ${customLeftPaddingInput}px;
					}

					& .mdc-notched-outline {
						& .mdc-notched-outline__leading {
							border-radius: ${topLeft}px 0px 0px ${bottomLeft}px;
							width: ${outlinedLeadingBlockWidth}px;
						}

						& .mdc-notched-outline__trailing {
							border-radius: 0px ${topRight}px ${bottomRight}px 0px;
						}
					}
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

	const getPaddingLabel = ({leadingIcon, isUnderlined, isFilled, borders, iconWidth}) => {
		if (!leadingIcon) {
			if (isUnderlined)
				return 0 // underlined label with no leading icon starts at 0px.
			else if (isFilled)
				return 16 // filled label with no leading icon starts at 16px.
			else { // outlined label with no leading icon starts at 16px if the border-radius is lower than 16.
				const outlinedLeadingBlockWidth = getOutlinedLeadingBlockWidth(borders)
				return outlinedLeadingBlockWidth < 16 ? 16 : outlinedLeadingBlockWidth
			}
		} else {
			const paddingFromIconStart = Math.round(1.35*iconWidth)
			if (isUnderlined)
				return paddingFromIconStart
			else if (isFilled)
				return 16 + paddingFromIconStart
			else {
				const outlinedLeadingBlockWidth = getOutlinedLeadingBlockWidth(borders)
				return 16 + paddingFromIconStart - (outlinedLeadingBlockWidth > DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH ? outlinedLeadingBlockWidth : DEFAULT_OUTLINED_LEADING_BLOCK_WIDTH)
			}
		}
	}

	const getPaddingInput = ({leadingIcon, isUnderlined, isFilled, borders, iconWidth}) => {
		if (!leadingIcon) {
			if (isUnderlined)
				return 0 // underlined label with no leading icon starts at 0px.
			else if (isFilled)
				return 16 // filled label with no leading icon starts at 16px.
			else { // outlined label with no leading icon starts at 16px if the border-radius is lower than 16.
				const outlinedLeadingBlockWidth = getOutlinedLeadingBlockWidth(borders)
				return outlinedLeadingBlockWidth < 16 ? 16 : outlinedLeadingBlockWidth
			}
		} else {
			const paddingFromIconStart = Math.round(1.35*iconWidth)
			if (isUnderlined)
				return paddingFromIconStart
			else if (isFilled)
				return 16 + paddingFromIconStart
			else {
				return 16 + paddingFromIconStart
			}
		}
	}

	const getCorrectTrailingIcon = (icon, showPasswordVisibilityIcon) => {
		const trailingMDIcon = iconToMaterial(icon)
		if (showPasswordVisibilityIcon)
			return { icon: 'visibility', class: trailingMDIcon ? trailingMDIcon.class : DEFAULT_MATERIAL_ICON_CLASS }
		else
			return trailingMDIcon
	}

	const changePasswordDisplay = (state, type) => {
		if (type != 'password')
			return

		if (state.fieldType == 'password') {
			state.trailingMDIcon = { ...state.trailingMDIcon, icon:'visibility_off' }
			state.fieldType = 'text'
		} else {
			state.trailingMDIcon = { ...state.trailingMDIcon, icon:'visibility' }
			state.fieldType = 'password'
		}

		// force re-render
		state = { ...state }
	}

	const setState = (state, options={}) => {
		state.id = _id
		state.isOutlined = variant == 'outlined'
		state.isUnderlined = !variant || variant == 'underlined'
		state.isFilled = variant == 'filled'
		state.isDate = type == 'datetime' || type == 'date'
		// Quadratic and linear equations' parameters found with tool at https://www.dcode.fr/function-equation-finder
		state.labelSizeFactor = fontScale <= 1  ? 1 : fontScale > 4 ? 0.6 : -0.0413257*fontScale*fontScale-0.00337725*fontScale+1.03947
		state.labelDenseScale = (dense ? 0.8 : 0.75)*state.labelSizeFactor
		state.animationSuffix = `${state.labelDenseScale}`.replace('0.','')
		state.showMaxChar = maxChar !== undefined && maxChar !== null && maxChar > 0
		state.showHelperTextOnly = helperText && !state.showMaxChar
		state.labelColor = TinyColor(primary).setAlpha(0.87).toRgbString()
		state.cssPadding = paddingParse(padding)
		// Icon dimensions (default is 24px width)
		state.iconWidth = fontScale <= 1 ? 24 : Math.round(fontScale*24)
		state.paddingLabel = getPaddingLabel({ leadingIcon, borders, ...state })
		state.paddingInput = getPaddingInput({ leadingIcon, borders, ...state })
		state.showPasswordVisibilityIcon = type == 'password' && passwordViewable

		const themeStyle = `
			--mdc-theme-primary: ${primary};
			--mdc-theme-error: ${error};
			& .mdc-text-field--focused:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid) .mdc-floating-label {
				color: ${state.labelColor};
			}
		`

		const inputStyle = type != 'file' ? '' : `
			& input {
				opacity: 0%;
			}
		`

		const fontStyle = `
			& input {
				font-size: ${fontScale}em !important;
			}

			& .mdc-floating-label--float-above {
				font-size: ${fontScale}em !important;
			}

			${!fontFamily ? '' : `
			& .mdc-text-field__input, .mdc-floating-label, .mdc-text-field-helper-text {
				font-family: ${fontFamily} !important;
			}
			`}
		`

		const leadingIconStyle = !leadingIcon ? '' : `
			& i.mdc-text-field__icon {
				font-size: ${state.iconWidth}px !important;	
			}

			& .mdc-text-field--with-leading-icon {
				& .mdc-floating-label {
					left: ${state.paddingLabel}px !important;
				}

				& .mdc-text-field__input, .fake-mdc-text-field__input {
					padding-left: ${state.paddingInput}px !important;
				}
			}

			& label > div:first-child {
				left: 16px;
				right: auto;
				position: absolute;
				height: 100%;
				width: ${state.iconWidth}px;
				display: flex;
				align-items: center;
			}

			& label.smui-text-field--standard > div:first-child {
				left: 0px;
			}

				& i.mdc-text-field__icon {
					left: unset !important;
				right: unset !important;
				position: unset !important;
				bottom: unset !important;
				}
		`

		const trailingIconStyle = !trailingIcon ? '' : `
			& .mdc-text-field--with-trailing-icon .mdc-text-field__icon {
				bottom: unset !important;
				align-self: center;
				font-size: ${state.iconWidth}px !important;
			}

			${fontScale <= 1 ? '' : `
			& .mdc-text-field--with-trailing-icon .mdc-text-field__input {
				padding-right: ${(state.isUnderlined ? 36 : 48) - 24 + state.iconWidth}px;
			}
			`}
		`
		
		const heightStyle = `
			& label.mdc-text-field {
				height: ${height}px !important;
			}
		`

		const textStyle = `
			& label.mdc-text-field {
				display: flex;
			}

			& span.mdc-floating-label {
				top: unset !important;
				align-self: center;
				font-size: ${fontScale}em !important;
				line-height: 120%;
			}

			& .mdc-notched-outline__notch {
				display:flex;
				align-items: center;
				padding-right: 0px !important;

				& span.mdc-floating-label {
					top: unset !important;
					font-size: ${fontScale}em !important;
					line-height: 120%;
				}
			}
		`

		const paddingStyle = `
			padding-top: ${state.cssPadding.top}px;
			padding-bottom: ${state.cssPadding.bottom}px;
			padding-right: ${state.cssPadding.right}px;
			padding-left: ${state.cssPadding.left}px;
		`

		state.passwordSwitchClass = css`
			width: ${state.isOutlined ? 48 : 26}px;
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

		// This bugs is part of the svelte-material-ui 1.0.0. The borders transitions on focus are not smoothed.
		const fixOutlinedBorderFlickeringStyle = !state.isOutlined ? '' : `
			& .mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing {
				transition: unset !important;
			}
		`

		const labelUpStyle = state.isOutlined ? '' : `
			& .mdc-floating-label--float-above {
				${transformLabelToTopLeft(null, state.labelDenseScale)}
			}

			& .mdc-floating-label--shake {
				animation: mdc-floating-label-shake-float-above-standard-${state.animationSuffix} .25s 1 !important;
			}

			@keyframes mdc-floating-label-shake-float-above-standard-${state.animationSuffix} {
				0% {
						${transformLabelToTopLeft(0, state.labelDenseScale, true)}
				}

				33% {
						animation-timing-function: cubic-bezier(.5, 0, .70173, .49582);
						${transformLabelToTopLeft(-6, state.labelDenseScale, true)}
				}

				66% {
						animation-timing-function: cubic-bezier(.30244, .38135, .55, .95635);
						${transformLabelToTopLeft(6, state.labelDenseScale, true)}
				}

				to {
						${transformLabelToTopLeft(0, state.labelDenseScale, true)}
				}
			}
		`

		state.helperHtmlText = helperText && Array.isArray(helperText) 
			? helperText.length ? `<ul class=${helperTextClass}>${helperText.map(t => `<li>${t}</li>`).join('')}</ul>` : ''
			: helperText

		const bordersStyle = getBorders({borders, ...state})
		const widthStyle = getWidth(width)
		state.leadingMDIcon = iconToMaterial(leadingIcon)
		state.fieldType = getFieldType({ type, ...state })
		state.trailingMDIcon = getCorrectTrailingIcon(trailingIcon, state.showPasswordVisibilityIcon)

		state.rootClass = css`
			${themeStyle}
			${textStyle}
			${inputStyle}
			${fontStyle}
			${leadingIconStyle}
			${trailingIconStyle}
			${paddingStyle}
			${bordersStyle}
			${widthStyle}
			${heightStyle}
			${fixOutlinedBorderFlickeringStyle}
			${labelUpStyle}
		`

		if (options.init)
			state.explicitValue = state.isOutlined ? '' : value
		else {
			// force re-render
			updateFile({file:state.explicitValue, placeholder, type, node})
			state = { ...state }
		}
	}

	/* 
	=======================================================
	END - FUNCTIONS
	=======================================================
	*/

	setState(state, { init:true })

	// COMPUTED


	$: {
		console.log(`UPDATE DETECTED FOR ID: ${_id}`)
		setState(state)
	}

	console.log(`INIT ID: ${_id}`)

	onMount(() => {
		setInputFile({ type, node, leadingIcon, fontScale, placeholder, ...state })
		if (state.isOutlined) {
			setOutlinedLabelStyle({node, labelUp, ...state})
			setOutlinedValue(state, value)
			setOutlinedDateFieldType(state, type)
		} else {
			setLabelUpStyle(labelUp, node, state.labelDenseScale)
		}
	})

</script>

<div class="{state.rootClass}" bind:this={node}>
	<Textfield
		id={_id}
		bind:value={state.explicitValue}
		class="shaped"
		label={label}
		invalid={invalid || undefined}
		variant={state.isUnderlined ? undefined : variant}
		dense={dense}
		type={state.fieldType}
		withLeadingIcon={leadingIcon ? true : undefined}
		withTrailingIcon={trailingIcon ? true : undefined}
		input$name={id}
		input$placeholder={placeholder || undefined}
		input$maxlength={state.showMaxChar ? maxChar : undefined}
		input$step={type == 'number' ? step : undefined}
		input$aria-controls={description}
		input$aria-describedby={description}>
		{#if state.leadingMDIcon}
			<div>
				<Icon class="{state.leadingMDIcon.class}">{state.leadingMDIcon.icon}</Icon>
			</div>
		{/if}

		{#if state.showPasswordVisibilityIcon}
			<div on:click={() => changePasswordDisplay(type)} style="display: flex;">
				<div class="{state.passwordSwitchClass}"></div>
				<Icon class="{state.trailingMDIcon.class}">{state.trailingMDIcon.icon}</Icon>
			</div>
		{:else if state.trailingMDIcon}
			<Icon class="{state.trailingMDIcon.class}">{state.trailingMDIcon.icon}</Icon>
		{/if}
	</Textfield>
	{#if state.showHelperTextOnly}
		<HelperText id={description} persistent={helperTextAlwaysOn ? true : undefined}>{@html state.helperHtmlText||''}</HelperText>
	{:else if state.showMaxChar}
		<HelperText id={description} persistent={helperTextAlwaysOn ? true : undefined}>
			{@html state.helperHtmlText||''}
			<span slot="character-counter"><CharacterCounter>0 / {maxChar}</CharacterCounter></span>
		</HelperText>
	{/if}
</div>



