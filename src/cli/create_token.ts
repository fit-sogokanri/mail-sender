import {read_input} from "../utils/read_stdio";
import {init} from "../utils/db";
import {TokenManager} from "../managers/TokenManager";

export const create_token = async ()=>{
    await init()
    const name = await read_input("トークンの名前を入力してください。\n> ");
    if(!name) return console.log("【エラー】名前が入力されていません。")

    const description = await read_input("説明を入力してください。(省略可)\n> ");
    const expires_how_long_srt = await read_input(
        "トークンの有効期限を入力してください。\n"+
        " 0 = 有効期限なし\n" +
        " d = n日後\n" +
        " w = n週間後\n" +
        " m = nヶ月後\n" +
        " y = n年後\n" +
        "> "
    )

    let expires: Date|null = new Date()

    const expires_how_long_srt_list = expires_how_long_srt.split("")
    if(expires_how_long_srt_list.length===1　&& expires_how_long_srt_list[0]==="0"){
        expires = null;
    }else{
        const suffix = expires_how_long_srt_list[expires_how_long_srt_list.length-1];
        let period_num = 0;
        try{
            period_num = parseInt(expires_how_long_srt_list
                .map((v: any, i: number)=>{return i<expires_how_long_srt_list.length-1? v:""})
                .join("")
            )
            switch (suffix){
                case "d": expires.setHours(expires.getHours() + period_num*24); break;
                case "w": expires.setHours(expires.getHours() + period_num*24*7); break;
                case "m": expires.setMonth(expires.getMonth() + period_num); break;
                case "y": expires.setMonth(expires.getMonth() + period_num*12); break;
                default: throw Error();
            }
        }catch (e) {
            return console.log("【エラー】有効期限のフォーマットが正しくありません。")
        }
    }

    const token  = await TokenManager.create(name, description, expires?expires.getTime():0)

    console.log(`${token.name}(${token.uuid})`);
    console.log(`トークン:${token.token}`);
}
