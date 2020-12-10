import App from './App.svelte'

const Doc = (typeof document !== 'undefined') ? document : null
const Win = (typeof window !== 'undefined') ? window : null

if (Doc && !Doc.currentScript)
	Doc.currentScript = (function() {
		var scripts = Doc.getElementsByTagName('script')
		return scripts[scripts.length - 1]
	})()

class FormJS extends App {
	constructor(config) {
		let { selector, forms, node } = config || {}

		if (!Doc && !node)
			throw new Error('Missing required \'config.node\'. When \'Doc\' is undefined, \'config.node\' is required.')

		const el = node || (selector ? Doc.querySelector(selector) : null) || Doc.body

		super({
			target: el,
			props: {
				name: 'world',
				forms
			}
		})
	}
}

const configString = (Doc ? Doc.currentScript.getAttribute('data-config') : null) || null 
let config
if (configString) {
	try {
		config = JSON.parse(configString)
	} catch (err) {
		console.error(`Failed to parse the 'data-config' attribute. Invalid JSON: ${err.message}`)
	}
}


const formJS = config ? new FormJS(config) : null

if (Win) {
	Win.FormJS = FormJS
	Win.formJS = formJS
}

export {
	FormJS,
	formJS
}