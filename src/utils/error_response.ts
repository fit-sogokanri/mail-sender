import express from "express";

export const send400 = (res: express.Response) =>{
    res.status(400).send({ error: "bad_request" })
}

export const send400_with_message = (res: express.Response, message: string) =>{
    res.status(400).send({ error: "bad_request", message: message})
}

export const send401 = (res: express.Response) =>{
    res.status(401).send({ error: "unauthorized" })
}

export const send401_with_message = (res: express.Response, message: string) =>{
    res.status(401).send({ error: "unauthorized", message: message})
}

export const send403 = (res: express.Response) =>{
    res.status(403).send({ error: "forbidden" })
}

export const send403_with_message = (res: express.Response, message: string) =>{
    res.status(403).send({ error: "forbidden", message: message})
}

export const send404 = (res: express.Response) =>{
    res.status(404).send({ error: "not_found" })
}

export const send404_with_message = (res: express.Response, message: string) =>{
    res.status(404).send({ error: "not_found", message: message})
}

export const send500 = (res: express.Response) =>{
    res.status(500).send({ error: "unknown" })
}

export const send500_with_message = (res: express.Response, message: string) =>{
    res.status(500).send({ error: "unknown", message: message})
}