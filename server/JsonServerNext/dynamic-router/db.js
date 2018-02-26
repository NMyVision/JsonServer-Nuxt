import express from "express"
import fs from "fs"
import path from "path"
import lowdb from "../lowdb"

export default opts => {
  const router = express.Router()

  function show(req, res, next) {
    console.log("--- db show ---")
    let { db } = res.locals
    if (db) res.locals.data = db.getState()
    next()
  }

  function create(req, res, next) {
    let { database, collection } = res.locals
    let dbname = opts.name(database)
    let db = lowdb(dbname, { autoCreate: true })

    console.log("--- db create ---", dbname, "database:", database, "collection:", collection)

    db.setState(req.body)
    db.write()

    res.locals.data = db.getState()
    next()
  }

  function update(req, res, next) {
    console.log("--- db update ---")
    let { db } = res.locals
    if (db) {
      let state = db.getState()
      if (req.method == "PUT") {
        db.setState(req.body)
      } else {
        let result = Object.assign(state, req.body)
        db.setState(result)
      }
      db.write()
      res.locals.data = db.getState()
    }
    next()
  }

  function remove(req, res, next) {
    console.log("--- db remove ---")
    try {
      if (!!req.query.remove) {
        let { database, collection } = res.locals
        let filename = path.join(__dirname, "..", opts.name(database))
        fs.unlinkSync(filename)
        res.status(200).end()
      }
    } catch (e) {
      console.error(e)
      return res.status(401).json({ status: "error" })
    }
  }

  router
    .route("/")
    .get(show)
    .post(create)
    .put(update)
    .patch(update)
    .delete(remove)

  return router
}
