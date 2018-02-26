import express from "express"
import jsonServer from "./JsonServerNext"
export default port => {
  const app = express()

  const opts = {
    static: null,
    // static: 'src/server/_public',
    // foreignKeySuffix: 'Id',
    name: name => {
      return `server/databases/dynamic/db.${name}.json`
    },
    // bodyParser: false,
    dynamicPath: "/!",
    paths: [
      {
        name: "/api",
        filename: "server/databases/db.demo.json"
      }
    ]
  }

  app.set("port", port)

  // dynamic JsonServer route
  jsonServer.create(app, opts)

  return app
}
