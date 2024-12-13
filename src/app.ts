import express from "express";
import cors from "cors";

import {router as APIRoutes} from "./routes/index"

const debug = require("debug")("mail-sender:app")

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}))

app.set('view engine', 'jade');
app.use("/", APIRoutes)

export {app}