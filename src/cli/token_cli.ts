import {get_token_list} from "./get_token_list";
import {create_token} from "./create_token";
import {delete_token} from "./delete_token";

const command_info = ()=>{
    const info = `command help:
    npm run token list|create|delete`
    console.log(info)
}

(async ()=>{
    if(process.argv.length === 2){
        command_info();
        process.exit(0);
    }

    switch(process.argv[2]){
        case "list":
        case "l":
            await get_token_list()
            break;

        case "create":
        case "c":
            await create_token()
            break

        case "delete":
        case "d":
            await delete_token()
            break;

        default:
            command_info()
    }

    process.exit(0)
})()
