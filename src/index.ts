import http from "http";
import {app} from "./app";
import { config } from "dotenv-safe";
import { init as db_init } from "./utils/db"

config();

const debug_mode = process.env.NODE_ENV==="development";
if (debug_mode) {
    // @ts-ignore
    //process.env.DEBUG = 'mail-sender:*'
}

const debug = require('debug')('mail-sender:index');

const port = parseInt(process.env.PORT || "3000", 10);

app.set("port", port)
const server = http.createServer(app)

Promise.all([db_init()])
    .then(res=>{
        server.listen(port);
    })

server.on("listening", ()=>{
    const address = server.address()
    const bind = typeof address === "string"
        ? "pipe " + address
        : "port " + address?.port
    debug("Listening on " + bind)
})

server.on("error", (error)=>{
    throw error;
})