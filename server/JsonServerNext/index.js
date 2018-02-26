import defaults from "./defaults"
import rewriter from "./rewriter"
import bodyParser from "./body-parser"
import staticRouter from "./static-router"
import dynamicRouter from "./dynamic-router"
import infoRouter from "./info-router"
import morgan from "morgan"

const create = (app, opts) => {
  app.set("json spaces", 2)
  app.use(bodyParser)
  app.use(morgan("dev"))

  const defs = {
    useDefault: true,
    static: "src/server/public",
    foreignKeySuffix: "Id",
    name: name => `/databases/dynamic/db.${name}.json`,
    bodyParser: false,
    infoPath: "/db",
    dynamicPath: "/api",
    paths: [],
    catchErrors: false
  }

  let o = Object.assign(defs, opts)

  // public page
  //if (o.useDefault) app.use(defaults(opts))

  // dynamic api routes
  if (o.dynamicPath) app.use(o.dynamicPath, dynamicRouter(o))

  // info api route
  if (o.infoPath) app.use(o.infoPath, infoRouter(o))

  // static api routes
  o.paths.forEach(p => {
    app.use(p.name, staticRouter(p.filename, o))
  })

  // app.use((err, req, res, next) => {
  //   console.clear()
  //   console.error("-- ERROR --", err.status)
  //   res.status(err.status || 500).json({ message: err.message, stack: err.stack })
  // })
}

export default {
  create,
  defaults,
  rewriter,
  bodyParser,
  staticRouter,
  dynamicRouter,
  infoRouter
}
