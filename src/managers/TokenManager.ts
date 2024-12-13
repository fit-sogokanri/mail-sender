import {QueryError, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import crypto from "node:crypto";
import {RecordOperationError, RecordOperationErrorCodes} from "../models/errors/RecordOperationError";
import {execute, get_all, get_first, query} from "../utils/db";
import {create_token_string, get_hash_string} from "../utils/token_string";
import {Tokens as tokens_format} from "../utils/format_check";
import {FormatError} from "../models/errors/FormatError";
import {NameQuery} from "../models/queries/NameQuery";
import {UuidQuery} from "../models/queries/UuidQuery";

const debug = require('debug')('mail-sender:managers:TokenManager')

export interface Token {
    uuid: string
    name: string
    description: string
    expires: number
    created_at: string
    updated_at: string
}

export interface TokenInTokenString {
    uuid: string
    token: string
    name: string
    description: string
    expires: number
    created_at: string
    updated_at: string
}


export class TokenManager {
    private static form_token(user_record: RowDataPacket): Token {
        return {
            uuid: user_record["uuid"],
            name: user_record["name"],
            description: user_record["description"],
            expires: user_record["expires"],
            created_at: user_record["created_at"],
            updated_at: user_record["updated_at"]
        };
    }
    private static form_token_in_token_string(user_record: RowDataPacket, token: string): TokenInTokenString {
        return {
            uuid: user_record["uuid"],
            token: token,
            name: user_record["name"],
            description: user_record["description"],
            expires: user_record["expires"],
            created_at: user_record["created_at"],
            updated_at: user_record["updated_at"]
        };
    }

    public static async get(
        uuid_query?: UuidQuery[],
        name_query?: NameQuery[],
    ): Promise<Token[]> {
        return new Promise(async (resolve, reject) => {

            const statement_set_part: string[] = []
            const set_placeholder: any[] = []

            if (uuid_query) {
                uuid_query.forEach(query => {
                    statement_set_part.push(query.get_sql_where_statement());
                    set_placeholder.push(query.get_sql_placeholder_value());
                })
            }
            if (name_query) {
                name_query.forEach(query => {
                    statement_set_part.push(query.get_sql_where_statement());
                    set_placeholder.push(query.get_sql_placeholder_value());
                })
            }

            const sql_statement = statement_set_part.length === 0 && set_placeholder.length === 0 ?
                `SELECT * FROM tokens` :
                `SELECT * FROM tokens WHERE ${statement_set_part.join(" AND ")}`;

            try {
                debug(sql_statement)
                debug(set_placeholder)
                const result = await get_all(sql_statement, set_placeholder);
                debug(result)
                resolve(result.map(record=>{
                    return this.form_token(record);
                }))
            } catch (e: QueryError | any) {
                reject(e)
            }
        })
    }

    public static async create(name: string, description: string, expires: number): Promise<TokenInTokenString> {
        return new Promise(async (resolve, reject) => {

            const bad_points: string[] = [];
            if (!tokens_format.name(name)) bad_points.push("name");
            if (!tokens_format.description(description)) bad_points.push("description");
            if (!tokens_format.expires(expires)) bad_points.push("expires");

            if (bad_points.length > 0) return reject(new FormatError(`Bad format of value(s).`, bad_points))

            const uuid = crypto.randomUUID();
            const token = create_token_string(uuid);
            const hash = get_hash_string(token);

            try {
                await execute(
                    `INSERT INTO tokens(uuid, hash, name, description, expires) VALUES (?,?,?,?,?,?)`,
                    [uuid, hash, name, description, expires]
                )
                const record = await get_first(`SELECT * FROM tokens WHERE uuid LIKE ?`, [uuid])
                if (!record) return reject(new RecordOperationError(`Cannot get insert token.`, `tokens`, RecordOperationErrorCodes.CANNOT_GET_RECORD))
                resolve(this.form_token_in_token_string(record, token));

            } catch (e: QueryError | any) {
                const message_list: string[] = e.sqlMessage.split(" ");
                const key = message_list[message_list.length - 1].replace(/'/g, "")

                if (e.code === "ER_DUP_ENTRY" && key === "PRIMARY") {
                    const message = `Duplicate value: ${key.replace(/PRIMARY/g, "uid")}`
                    reject(new RecordOperationError(message, "tokens", RecordOperationErrorCodes.DUPLICATE_PRIMARY_KEY));
                } else if (e.code === "ER_DUP_ENTRY") {
                    const message = `Duplicate value: ${key}`
                    reject(new RecordOperationError(message, "tokens", RecordOperationErrorCodes.DUPLICATE_UNIQUE_KEY));
                }
            }
        })
    }

    public static async edit(
        uuid: string,
        after_name?: string,
        after_description?: string,
        after_expires?: number
    ) {
        return new Promise<void>(async (resolve, reject) => {
            const bad_points: string[] = [];
            if (after_name && !tokens_format.name(after_name)) bad_points.push("name");
            if (after_description && !tokens_format.description(after_description)) bad_points.push("description");
            if (after_expires && !tokens_format.expires(after_expires)) bad_points.push("expires");

            if (bad_points.length > 0) return reject(new FormatError(`Bad format of value(s).`, bad_points))

            const statement_set_part: string[] = []
            const set_placeholder: any[] = []

            if (after_name) {
                statement_set_part.push("name=?");
                set_placeholder.push(after_name);
            }
            if (after_description) {
                statement_set_part.push("description=?");
                set_placeholder.push(after_description);
            }
            if (after_expires) {
                statement_set_part.push("expires=?");
                set_placeholder.push(after_expires);
            }

            if (statement_set_part.length === 0 || set_placeholder.length === 0) return reject(new FormatError(`Request body is empty.`, []))

            try {
                const result = await query<ResultSetHeader>(
                    `UPDATE tokens SET ${statement_set_part.join(", ")} WHERE uuid LIKE ?`, [...set_placeholder, uuid]
                );
                debug(result)
                if (result["affectedRows"] === 0) return reject(new RecordOperationError(`'${uuid}' is not found`, `tokens`, RecordOperationErrorCodes.NOT_FOUND_RECORD));
                resolve()

            } catch (e: QueryError | any) {
                const message_list: string[] = e.sqlMessage.split(" ");
                const key = message_list[message_list.length - 1].replace(/'/g, "")

                if (e.code === "ER_DUP_ENTRY" && key === "PRIMARY") {
                    const message = `Duplicate value: ${key.replace(/PRIMARY/g, "uid")}`
                    reject(new RecordOperationError(message, "users", RecordOperationErrorCodes.DUPLICATE_PRIMARY_KEY));
                } else if (e.code === "ER_DUP_ENTRY") {
                    const message = `Duplicate value: ${key}`
                    reject(new RecordOperationError(message, "users", RecordOperationErrorCodes.DUPLICATE_UNIQUE_KEY));
                }
            }
        })
    }

    public static delete(uuid: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const result = await query<ResultSetHeader>(`DELETE FROM tokens WHERE uuid LIKE ?`, [uuid]);
                debug(result)
                if (result["affectedRows"] === 0) reject(new RecordOperationError(`'${uuid}' is not found`, `tokens`, RecordOperationErrorCodes.NOT_FOUND_RECORD));
                resolve()
            } catch (e: QueryError | any) {

            }
        })
    }

    public static async authenticate(token_str: string): Promise<boolean> {
        const hash = get_hash_string(token_str);
        const list = await get_first(
            "SELECT id, name FROM tokens WHERE hash LIKE ? AND (expires>=? OR expires=0)",
            [hash, Date.now()]
        )

        return !!list
    }
}