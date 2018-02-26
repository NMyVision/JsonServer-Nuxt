import express from "express"
import methodOverride from "method-override"
import _ from "lodash"
import lowdb from "../lowdb"
import bodyParser from "../body-parser"
import plural from "./plural"
import nested from "./nested"
import singular from "./singular"

export default (source, opts) => {
  console.log("source:", source)

  // Create router
  const router = express.Router()

  // Add middlewares
  router.use(methodOverride())
  router.use(bodyParser)

  let db = lowdb(source, { autoCreate: true })

  // Expose database
  router.db = db

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data)
  }

  // GET /db
  router.get("/db", (req, res) => {
    res.jsonp(db.getState())
  })

  // Handle /:parent/:parentId/:resource
  router.use(nested(opts))

  // Create routes
  db
    .forEach((value, key) => {
      if (_.isPlainObject(value)) {
        router.use(`/${key}`, singular(db, key))
        return
      }

      if (_.isArray(value)) {
        router.use(`/${key}`, plural(db, key, opts))
        return
      }

      const msg =
        `Type of "${key}" (${typeof value}) ${_.isObject(source) ? "" : `in ${source}`} is not supported. ` +
        `Use objects or arrays of objects.`

      throw new Error(msg)
    })
    .value()

  router.use((req, res) => {
    if (!res.locals.data) {
      res.status(404)
      res.locals.data = {}
    }

    router.render(req, res)
  })

  // router.use((err, req, res, next) => {
  //   console.log("StaticRouter", err.status)
  //   console.error(err.stack)
  //   res.status(500).send(err.stack)
  // })

  return router
}
