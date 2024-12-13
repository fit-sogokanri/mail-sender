import express from "express";
import {send400} from "../utils/error_response";
import {validate_authorization} from "../utils/validate_authorization";

const debug = require('debug')('mai-sender:routes:logout')

export const router = express.Router();

router.post("/",
    validate_authorization,
    async (req, res) => {
        res.status(200).json({message: "ok"});
    });