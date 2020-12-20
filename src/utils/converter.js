/**
 * Converts a value to an cardinal object (e.g., { top: '0px', bottom: '0px', left: '0px', right: '0px' })
 * 
 * @param   {Number|Object} val				e.g., 10 or { top: 10, bottom: 10 }
 * @param   {Number} 		val.top			Default 0	
 * @param   {Number} 		val.bottom		Default 0	
 * @param   {Number} 		val.left		Default 0	
 * @param   {Number} 		val.right		Default 0	
 * 
 * @return  {Number} 		output.top		e.g., 0
 * @return  {Number} 		output.bottom	e.g., 0
 * @return  {Number} 		output.left		e.g., 0
 * @return  {Number} 		output.right	e.g., 0
 */
export const paddingParse = (val) => {
	if (typeof(val) != 'object') {
		const v = val
		return {
			top: v,
			bottom: v,
			left: v,
			right: v
		}
	} else {
		const result = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		}

		if (val.top)
			result.top = val.top
		if (val.bottom)
			result.bottom = val.bottom
		if (val.left)
			result.left = val.left
		if (val.right)
			result.right = val.right

		return result
	}
}

const _cornerObjectParse = ({ top, left, bottom, right }) => {
	const topObj = !top ? {} : typeof(top) == 'number' ? { left:top, right:top } : typeof(top) == 'object' ? { left:top.left||0, right:top.right||0 } : {}
	const bottomObj = !bottom ? {} : typeof(bottom) == 'number' ? { left:bottom, right:bottom } : typeof(bottom) == 'object' ? { left:bottom.left||0, right:bottom.right||0 } : {}
	const rightObj = !right ? {} : typeof(right) == 'number' ? { top:right, bottom:right } : typeof(right) == 'object' ? { top:right.top||0, bottom:right.bottom||0 } : {}
	const leftObj = !left ? {} : typeof(left) == 'number' ? { top:left, bottom:left } : typeof(left) == 'object' ? { top:left.top||0, bottom:left.bottom||0 } : {}

	return {
		topLeft: topObj.left || leftObj.top || 0,
		topRight: topObj.right || rightObj.top || 0,
		bottomLeft: bottomObj.left || leftObj.bottom || 0,
		bottomRight: bottomObj.right || rightObj.bottom || 0
	}
}

/**
 * Converts a corner value (usually used for border-radius) into a corner object. 
 * 
 * @param  {Number|Object}	val					e.g., 10 
 *                                 				or { top: { left: 10 }, bottom: { right: 10 } } 
 *                                 				or { left: { top:10 } }
 *                                 				or { top: 10 }, which is a short for { top: { right: 10, left: 10 } }
 * 
 * @return {Number}			output.topLeft		e.g., '10px'
 * @return {Number}			output.topRight		e.g., '10px'
 * @return {Number}			output.bottomLeft	e.g., '10px'
 * @return {Number}			output.bottomRight	e.g., '10px'
 */
export const cornerParse = val => {
	return typeof(val) == 'object' 
		? _cornerObjectParse(val)
		: {
			topLeft: val, 
			topRight: val,
			bottomLeft: val,
			bottomRight: val
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







