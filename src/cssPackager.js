import { injectGlobal } from '@emotion/css/dist/emotion-css.esm.js'

if (process.env.isProd) {
	injectGlobal`
		div.openform-stylesheet {
			& ${process.env.BUNDLE_CSS}
		}
	`
}