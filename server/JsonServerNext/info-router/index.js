import express from "express"
import path from "path"
import fs from "fs"
export default opts => {
  // Create router
  const router = express.Router()

  //let { paths } = opts

  function discoverHandler() {
    let folder = path.dirname(opts.name(""))
    return (req, res, next) => {
      let files = fs
        .readdirSync(folder)
        .map(file => path.basename(file))
        .map(file => file.substring(3, file.lastIndexOf(".")))
      res.send(files)
      next()
    }
  }

  router.get("/", discoverHandler(opts))

  return router
}
