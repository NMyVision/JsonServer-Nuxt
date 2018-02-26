import { Nuxt, Builder } from "nuxt"
import Bootstrap from "./app"

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js")
config.dev = !(process.env.NODE_ENV === "production")

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

const port = process.env.PORT || 3057

const app = Bootstrap(port)

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, () => {
  // console.clear() // eslint-disable-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})
