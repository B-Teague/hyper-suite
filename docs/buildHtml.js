import fs from 'fs'
import path from 'path'
import { extractCss, app } from '../dist/index.js'
import { init, view } from './app.js'
import { renderToString } from 'hyperapp-render'

const appHtml = renderToString(view(init));

const css = extractCss()

const htmlDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Calculator SSR</title>
<style>${css}</style>
</head>
<body>
  <div id="app">${appHtml}</div>
  <script type="module" src="./main.js"></script>
</body>
</html>
`

fs.writeFileSync(path.resolve('./index.html'), htmlDocument)

console.log('SSR build complete.')
