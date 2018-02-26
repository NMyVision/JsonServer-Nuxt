import { isObject, isFunction, isArray, isPlainObject } from "lodash"
import lowdb from "../lowdb"
import fs from "fs"
import path from "path"
export function NotFound() {
  console.log("--- NotFound ---")
  let error = new Error("Not Found")
  error.status = 404
  throw error
}

export function initHandler(opts, descr) {
  console.log("--- init ---", descr)

  return (req, res, next) => {
    let { database, collection } = req.params
    let dbname = opts.name(database)
    let db = lowdb(dbname)
    console.log("--- init ---", dbname, "database:", database, "collection:", collection, "db ->", db ? true : false)

    res.locals.name = collection
    res.locals.collection = collection
    res.locals.database = database
    if (db) {
      res.locals.db = db
      res.locals.filename = dbname
    }
    next()
  }
}

export function preloadHandler(req, res, next) {
  console.log("--- preload ---")
  let { db, database, collection } = res.locals

  if (db == null) NotFound()

  let value = db.get(collection).value()
  if (value == undefined) NotFound()

  let ipo = isPlainObject(value)
  let ia = isArray(value)
  if (!ipo && !ia) {
    const msg =
      `Type of "${collection}" (${typeof value}) ${isObject(collection) ? "" : `in ${database}`} is not supported. ` +
      `Use objects or arrays of objects.`
    return res.status(401).json({ error: msg })
  }

  res.locals.isSingle = ipo
  res.locals.isPlural = !ipo

  next()
}

export function displayHandler(req, res, next) {
  console.log("--- display ---")
  if (!res.locals.data) NotFound()

  res.json(res.locals.data)
}

export function clearHandler(req, res, next) {
  console.clear()
  next()
}
