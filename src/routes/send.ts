import express from "express";
import {send400_with_message, send500_with_message} from "../utils/error_response";
import {validate_authorization} from "../utils/validate_authorization";
import {MailManager} from "../managers/MailManager";
import {Mail} from "../models/Mail";
import {FormatError} from "../models/errors/FormatError";
import {SendMailError} from "../models/errors/SendMailError";

const debug = require('debug')('mai-sender:routes:send')

export const router = express.Router();

router.post("/",
    validate_authorization,
    async (req, res) => {
        const body = await req.body;

        try{
            const mail = Mail.parse(body);
            const mail_response = await MailManager.send(mail);
            res.status(200).send(mail_response.get_object());
        }catch(e){
            if(e instanceof FormatError) return send400_with_message(res, `${e.message}: ${e.bad_points.join(", ")}`);
            if(e instanceof SendMailError) return send500_with_message(res, `${e.message}`);
            send500_with_message(res, `unknown error.`);
        }
    });
