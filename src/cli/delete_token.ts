import {read_input} from "../utils/read_stdio";
import {init} from "../utils/db";
import {TokenManager} from "../managers/TokenManager";
import {UuidQuery} from "../models/queries/UuidQuery";

export const delete_token = async (): Promise<void> => {
    await init()
    const uuid = await read_input("トークンのuuidを入力してください。\n> ");
    if(!uuid) return console.log("【エラー】uuidが入力されていません。")

    const uuid_query = new UuidQuery(uuid);
    const tokens  = await TokenManager.get([uuid_query]);
    if(!tokens || tokens.length===0) return console.log("【エラー】指定されたuuidのトークンがありません。");

    const token = tokens[0];
    const really_delete = await read_input(`${token.name}(${token.uuid})を削除しますか？ Y/n`)
    if(really_delete.toLowerCase() !== "y") return console.log("削除を中止しました。");

    await TokenManager.delete(token.uuid);

    console.log(`トークン ${token.name}(${token.uuid})を削除しました。`);
    process.exit(0)
}
