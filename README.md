# OpenformJS &middot; [![Tests](https://travis-ci.org/nicolasdao/openform.svg?branch=master)](https://travis-ci.org/nicolasdao/openform) [![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
__*Openform*__ is a front-end JS package that helps building forms. It is built using Svelte 3.0.

# Table of contents

> * [Getting started](#getting-started)
>	- [Install](#install)
>	- [Creating a form](#creating-a-form)
>	- [Updating a form](#updating-a-form)
> * [Dev](#dev)
>	- [Run locally](#run-locally)
>	- [Deploy](#deploy)

# Getting started
## Install
### CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/openform" />
```

> To install a specific version:
> ```html
> <script defer src="https://cdn.jsdelivr.net/npm/openform@0.0.6" />
> ```
> All the files are available at https://cdn.jsdelivr.net/npm/openform/public/build

### NPM

```
npm i openform
```

In your code:

```js
import import { FormJS } from 'openform'
```

## Creating a form

The following code snippet creates a new form under a DOM with id `main`:

```js
const form = new FormJS({
	selector:'#main',
	forms: [{
		fields:[{
			id: 'cloud_platform',
			type:'select',
			// label: 'First name',
			placeholder: 'Choose a Cloud platform',
			values: [
				'AWS',
				'Google Cloud',
				'Both AWS and Google Cloud'
			],
			style: {
				col_md: 12,
				col_lg: 6,  
			}
		}, {
			id: 'full_name',
			type:'text',
			// label: 'First name',
			placeholder: 'Enter your full name',
			style: {
				col_md: 12,
				col_lg: 6,  
			}
		}, {
			id: 'email',
			type:'email',
			// label: 'Email',
			placeholder: 'Enter your email',
			style: {
				col_md: 12,
				col_lg: 6,  
			}
		}, {
			id: 'city',
			type:'select',
			// label: 'Last name',
			placeholder: 'Choose a city',
			values:[
				'Sydney',
				'Singapore',
				'Los Angeles'
			],
			style: {
				col_md: 12,
				col_lg: 6,  
			}
		}, {
			id: 'message',
			type:'textarea',
			// label: 'Email',
			placeholder: 'Type your enquiry details here',
			style: {
				col_md: 12,
				col_lg: 6,  
			}
		}, {
			id: 'submit',
			type:'button',
			label: 'Submit'
		}]
	}]
})
```

It is also possible to replace the `selector` with an explicit DOM node as follow:

```js
const form = new FormJS({
	node: document.getElementById('main'),
	forms: [{...}]
})
```

## Updating a form

```js
form.$set({ forms: updatedForms })
```

# Dev
## Run locally
To run this project locally:

```
npm run dev
```

## Deploy

1. Lint:
```
npm run lint
```
2. Build:
```
npm run build
```
3. Commit changes
4. Check version
```
npm run v
```
5. Bump version:
```
npm run rls <new version>
```
6. Deploy:
```
npm run push
```


