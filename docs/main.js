import { app } from './index.js'
import { init, view } from './app.js'

app({
  init,
  view,
  node: document.getElementById("app"),
});