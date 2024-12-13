import mysql, {ResultSetHeader, RowDataPacket} from "mysql2/promise";
import { config } from "dotenv-safe";
config();

const debug = require('debug')('mail-sender:utils:db')

const connection_config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionLimit: 3, // 接続を張り続けるコネクション数を指定
    namedPlaceholders: true, // 設定必須
}
debug(connection_config)

const db = mysql.createPool(connection_config)

/**
 * データベースを初期化します。
 */
export const init = async () => {
    debug(`Create Database tables...`)

    db.execute(`CREATE TABLE IF NOT EXISTS tokens (
                    \`uuid\` VARCHAR(128) NOT NULL ,
                    \`hash\` VARCHAR(128) NOT NULL ,
                    \`name\` VARCHAR(225) NOT NULL ,
                    \`description\` VARCHAR(255) NOT NULL ,
                    \`expires\` BIGINT NOT NULL ,
                    \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
                    \`updated_at\` DATETIME on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
                    PRIMARY KEY (\`uuid\`),
                    UNIQUE (\`hash\`)
            )`
    );

    debug(`Finish to create Database tables.`)

}

/**
 * SQL文を実行し、結果を返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<unknown>}
 */
export const query = async <T extends RowDataPacket[] | ResultSetHeader>(statement: string, placeholder: any[]): Promise<T> => {
    const [rows] = await db.query<T>(statement, placeholder);
    return rows;
};

/**
 * SQL文を実行します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 */
export const execute = async (statement: string, placeholder: any[]) => {
    await db.execute(statement, placeholder);
};


/**
 * SQL文を実行し、該当する結果を配列ですべて返します。
 * @param {string}statement SQL文
 * @param {any[]}[placeholder] プレースホルダー
 * @return {Promise<[unknown]>}
 */
export const get_all = async (statement: string, placeholder: any[]): Promise<RowDataPacket[]> => {
    return new Promise(async (resolve, reject) => {
        try{
            if (!statement.toLowerCase().startsWith("select")) {
                reject(new Error("Cannot use this sql statement."))
            }

            const [rows] = await db.query<RowDataPacket[]>(statement, placeholder);
            resolve(rows)
        }catch (e){
            debug(e)
            reject(e)
        }
    })
};

/**
 * SQL文を実行し、該当する結果のうち、1番最初のデータを返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<unknown>}
 */
export const get_first = async (statement: string, placeholder: any[]): Promise<RowDataPacket> => {
    return new Promise(async (resolve, reject) => {
        try{
            if (!statement.toLowerCase().startsWith("select")) {
                reject(new Error("Cannot use this sql statement."));
            }

            const [rows] = await db.query<RowDataPacket[]>(statement, placeholder);

            resolve(rows[0]);
        }catch (e){
            debug(e);
            reject(e);
        }
    })
};
