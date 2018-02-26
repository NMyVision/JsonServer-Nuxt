import fs from "fs"
import _ from "lodash"
import lodashId from "lodash-id"
import low from "lowdb"
import FileAsync from "lowdb/adapters/FileSync"
import mixins from "./mixins"
import validateData from "./validate-data"

export default (source, opts = { autoCreate: false }) => {
  let db
  if (_.isObject(source)) {
    db = low()
    db.setState(source)
  } else {
    try {
      fs.accessSync(source)
    } catch (e) {
      if (!opts.autoCreate) return null
    }
    // create if does not already exist
    db = low(new FileAsync(source))
  }

  // confirm the state of the db
  validateData(db.getState())

  // Add lodash-id methods to db
  db._.mixin(lodashId)

  // Add specific mixins
  db._.mixin(mixins)

  return db
}
