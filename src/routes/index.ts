import express from "express"

import {router as send_router} from "./send"

export const router = express.Router();
router.use('/send', send_router);

router.get('/', (req, res) => {
    return res.status(200).send({"message": "reached"});
})