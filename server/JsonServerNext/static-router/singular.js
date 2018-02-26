import express from "express"
import getFullURL from "../get-full-url"
import delay from "../delay"
import write from "./write"

export default (db, name) => {
  const router = express.Router()
  router.use(delay)

  function show(req, res, next) {
    console.log("--S: Show--")
    if (!db) {
      if (res.locals.isPlural) {
        next()
        return
      }
      db = res.locals.db
      name = res.locals.collection
    }

    res.locals.data = db.get(name).value()
    next()
  }

  function create(req, res, next) {
    console.log("--S: Create--")
    if (!db) {
      if (res.locals.isPlural) {
        next()
        return
      }
      db = res.locals.db
      name = res.locals.collection
    }
    db.set(name, req.body).value()
    res.locals.data = db.get(name).value()

    res.setHeader("Access-Control-Expose-Headers", "Location")
    res.location(`${getFullURL(req)}`)

    res.status(201)
    next()
  }

  function update(req, res, next) {
    if (!db) {
      if (res.locals.isPlural) {
        next()
        return
      }
      db = res.locals.db
      name = res.locals.collection
    }
    if (req.method === "PUT") {
      db.set(name, req.body).value()
    } else {
      db
        .get(name)
        .assign(req.body)
        .value()
    }

    res.locals.data = db.get(name).value()
    next()
  }

  const w = write(db)

  router
    .route("/")
    .get(show)
    .post(create, w)
    .put(update, w)
    .patch(update, w)

  return router
}
