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