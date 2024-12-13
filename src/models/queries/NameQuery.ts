import {MatchPattern, StringQuery} from "./base/StringQuery";

export class NameQuery extends StringQuery{
    constructor(value: string);
    constructor(value: string, match_pattern?: MatchPattern);
    constructor(arg0: string, arg1?: MatchPattern){
        if(arg1) super("name", arg0, arg1)
        else super("name", arg0)
    }
}