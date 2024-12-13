import crypto from "node:crypto";

/**
 * トークンの文字列を生成します。
 * @param {string}str
 * @return {string}
 */
export const create_token_string = (str: string)=>{
    const token_raw = crypto.randomUUID() + process.env.SALT  + str + Date.now();
    const base64_token_raw = Buffer.from(token_raw).toString('base64');
    const rmd160_toke_raw = crypto.createHash('rmd160').update(base64_token_raw).digest('hex');
    const token = Buffer.from(rmd160_toke_raw).toString('base64').replace(/==/g,"");

    return token;
}

/**
 * 与えられた文字列のハッシュを返します。
 * アルゴリズム: sha256
 * @param {string}str
 * @return {string}
 */
export const get_hash_string = (str: crypto.BinaryLike)=>{
    return crypto.createHash('sha256').update(str).digest('hex');
}
