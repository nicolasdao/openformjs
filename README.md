# OpenformJS &middot; [![Tests](https://travis-ci.org/nicolasdao/openform.svg?branch=master)](https://travis-ci.org/nicolasdao/openform) [![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
__*Openform*__ is a front-end JS package that helps building forms. It is built using Svelte 3.0.

# Table of contents

> * [Getting started](#getting-started)
>	- [Install](#install)
> * [Dev](#dev)
>	- [Run locally](#run-locally)
>	- [Deploy](#deploy)

# Getting started
## Install
### Browser

```html
<script defer src="https://cdn.jsdelivr.net/npm/openform/public/build/bundle.js" />
```

> To install a specific version:
> ```html
> <script defer src="https://cdn.jsdelivr.net/npm/openform@0.0.1/public/build/bundle.js" />
> ```

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


