import { app } from '../dist/index.js'
import { init, view } from './app.js'

app({
  init,
  view,
  node: document.getElementById("app"),
});