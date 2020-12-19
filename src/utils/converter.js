/**
 * Converts a value to an cardinal object (e.g., { top: '0px', bottom: '0px', left: '0px', right: '0px' })
 * 
 * @param   {Number|Object} val				e.g., 10 or { top: 10, bottom: 10 }
 * @param   {Number} 		val.top			Default 0	
 * @param   {Number} 		val.bottom		Default 0	
 * @param   {Number} 		val.left		Default 0	
 * @param   {Number} 		val.right		Default 0	
 * 
 * @return  {Number} 		output.top		e.g., '0px'
 * @return  {Number} 		output.bottom	e.g., '0px'
 * @return  {Number} 		output.left		e.g., '0px'
 * @return  {Number} 		output.right	e.g., '0px'
 */
export const cardinalParse = (val) => {
	if (typeof(val) != 'object') {
		const v = `${val}px`
		return {
			top: v,
			bottom: v,
			left: v,
			right: v
		}
	} else {
		const result = {
			top: '0px',
			bottom: '0px',
			left: '0px',
			right: '0px'
		}

		if (val.top)
			result.top = `${val.top}px`
		if (val.bottom)
			result.bottom = `${val.bottom}px`
		if (val.left)
			result.left = `${val.left}px`
		if (val.right)
			result.right = `${val.right}px`

		return result
	}
}

/**
 * Converts a icon name into a material icon object.
 * 
 * @params {String}	icon 			e.g., 'email-outlined'
 * 
 * @params {String}	output.icon	 	e.g., 'email'
 * @params {String}	output.class	e.g., 'material-icons-outlined'. Valid values: 
 *         								'material-icons'
 *         								'material-icons-outlined'
 *         								'material-icons-round'
 *         								'material-icons-sharp'
 *         								'material-icons-two-tone'
 */
export const iconToMaterial = icon => {
	if (!icon)
		return 

	const [iconName, ...rest] = icon.split('-')
	return {
		icon: iconName,
		class: rest.length ? `material-icons-${rest.join('-')}` : 'material-icons'
	}
}







