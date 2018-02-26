import express from "express"
import dbHandler from "./db"
import { clearHandler, initHandler, displayHandler, preloadHandler, discoverHandler } from "./handlers"
import pluralHandler from "../static-router/plural"
import nestedHandler from "../static-router/nested"
import singularHandler from "../static-router/singular"

export default opts => {
  // Create router
  const router = express.Router()

  function Log(message) {
    return (req, res, next) => {
      console.log(message)
      next()
    }
  }

  router.use("/:database/db", initHandler(opts, "A"), dbHandler(opts), displayHandler)
  router.use("/:database", initHandler(opts, "B"), nestedHandler(opts))

  router.use(
    "/:database/:collection/",
    initHandler(opts, "C"),
    preloadHandler,
    singularHandler(),
    pluralHandler(null, null, opts)
  )

  router.all("/*?", Log("All"), displayHandler)

  return router
}
