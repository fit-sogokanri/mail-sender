import {MatchPattern, StringQuery} from "./base/StringQuery";

export class UuidQuery extends StringQuery{
    constructor(value: string);
    constructor(value: string, match_pattern?: MatchPattern);
    constructor(arg0: string, arg1?: MatchPattern){
        if(arg1) super("uuid", arg0, arg1)
        else super("uuid", arg0)
    }
}