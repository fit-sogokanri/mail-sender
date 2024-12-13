import express from "express";
import {send401} from "./error_response";
import {TokenManager} from "../managers/TokenManager";

const debug = require('debug')('mail-sender:utils:validate_authorization')

export const validate_authorization = async (req: express.Request, res: express.Response, next: express.NextFunction) =>{
    const token_header = req.headers["mailsender-token"];

    if(token_header && typeof token_header==="string"){
        debug(`token_header: ${token_header}`);
        const state = await TokenManager.authenticate(token_header);

        debug(`Result authorized token: ${state}`);
        if(state) return next();
    }
    return send401(res);
}
