import {BaseQuery} from "./BaseQuery";

export const MatchPattern = {
    prefix: 0,
    suffix: 1,
    exact: 2,
    middle: 3,
    not: 4,
} as const;
export type MatchPattern = (typeof MatchPattern)[keyof typeof MatchPattern];

export class StringQuery extends BaseQuery<string>{
    public readonly match_pattern: MatchPattern;

    constructor(key: string, value: string);
    constructor(key: string, value: string, match_pattern: MatchPattern);
    constructor(arg0: string, arg1: string, arg2?: any){
        const match_pattern: MatchPattern = ((): MatchPattern=>{
            if(arg2) return arg2;
            else if(arg1.startsWith("*") && arg1.endsWith("*")) return MatchPattern.middle;
            else if(arg1.startsWith("*")) return MatchPattern.prefix;
            else if(arg1.endsWith("*")) return MatchPattern.suffix;
            else return MatchPattern.exact;
        })()

        super(arg0, arg1.replace(/\*/g,""))
        this.match_pattern = match_pattern;
    }

    override get_sql_where_statement(): string {
        switch (this.match_pattern){
            case MatchPattern.not:
                return `${this.key} NOT LIKE ?`
            default:
                return `${this.key} LIKE ?`
        }
    }

    override get_sql_placeholder_value(): string {
        switch (this.match_pattern){
            case MatchPattern.prefix:
                return `%${this.value}`
            case MatchPattern.suffix:
                return `${this.value}%`
            case MatchPattern.middle:
                return `%${this.value}%`
            default:
                return this.value
        }
    }
}