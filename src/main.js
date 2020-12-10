import App from './App.svelte'

if (document && !document.currentScript)
	document.currentScript = (function() {
		var scripts = document.getElementsByTagName('script')
		return scripts[scripts.length - 1]
	})()

class FormJS extends App {
	constructor(config) {
		let { selector, forms, node } = config || {}

		if (!document && !node)
			throw new Error('Missing required \'config.node\'. When \'document\' is undefined, \'config.node\' is required.')

		const el = node || (selector ? document.querySelector(selector) : null) || document.body
		
		super({
			target: el,
			props: {
				name: 'world',
				forms
			}
		})
	}
}

const configString = document.currentScript.getAttribute('data-config') || null 
let config
if (configString) {
	try {
		config = JSON.parse(configString)
	} catch (err) {
		console.error(`Failed to parse the 'data-config' attribute. Invalid JSON: ${err.message}`)
	}
}


const formJS = config ? new FormJS(config) : null

if (window) {
	window.FormJS = FormJS
	window.formJS = formJS
}

export {
	FormJS,
	formJS
}