
const uid = (uid_str: string): boolean =>{
    const regex = new RegExp("^[a-z][0-9a-z_\-]{4,63}$", "g")
    return regex.test(uid_str);
}

const name = (name_str: string): boolean =>{
    const length = [...name_str].length
    return length<256;
}

const mail = (mail_str: string): boolean =>{
    const regex = new RegExp("^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$", "g")
    return regex.test(mail_str);
}

const password = (password_str: string): boolean =>{
    const regex = new RegExp("^[0-9A-Za-z\-\_\/\*\+\.\,\!\#\$\%\&\(\)\~\|]{8,}$", "g")
    return regex.test(password_str);
}

const active = (active_str: string): boolean =>{
    const regex = new RegExp("^(true|false|0|1)$", "g")
    return regex.test(active_str);
}

const idm = (idm_string: string): boolean =>{
    const regex = new RegExp("^[a-zA-Z0-9]{16}$", "g")
    return regex.test(idm_string);
}

const note = (note_string: string): boolean =>{
    const regex = new RegExp(".{0,1024}", "g")
    return regex.test(note_string);
}

const description = (note_string: string): boolean =>{
    const regex = new RegExp(".{0,256}", "g")
    return regex.test(note_string);
}

const expires = (expires_number_or_string: number|string): boolean =>{
    //const regex = new RegExp(".{0,1024}", "g")
    //return regex.test(expires_number);
    if(typeof expires_number_or_string === "string"){
        try{
            parseInt(expires_number_or_string);
        }catch (e){
            return false;
        }
    }

    return true;
}

const uuid = (uuid_string: string): boolean=>{
    return true;
}



export const Tokens = {
    uuid: uuid,
    name: name,
    description: description,
    expires: expires
}