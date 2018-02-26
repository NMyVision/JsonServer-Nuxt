export default db => {
  return (req, res, next) => {
    console.log("--- write ---")
    if (!db) {
      db = res.locals.db
    }
    db.write()
    next()
  }
}
