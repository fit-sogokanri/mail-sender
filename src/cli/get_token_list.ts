import {init} from "../utils/db";
import {TokenManager} from "../managers/TokenManager";

const get_datetime_string = (date_obj: Date, time_zone: number = 0): string => {
    const year = date_obj.getUTCFullYear();
    const month = date_obj.getUTCMonth()+1;
    const date = date_obj.getUTCDate();
    const hours = (date_obj.getUTCHours() + time_zone);
    const minutes = date_obj.getUTCMinutes();
    const seconds = date_obj.getUTCSeconds();
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

export const get_token_list = async (): Promise<void> =>{
    await init()
    const tokens = await TokenManager.get()

    console.log("トークン一覧")
    tokens.forEach((token, i)=>{
        console.log(`${i+1}. ${token.name}(${token.uuid}) 説明: "${token.description}",  有効期限: ${get_datetime_string(new Date(token.expires),9)}`)
    })
}