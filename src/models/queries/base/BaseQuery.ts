export interface KeyValueSet{
    key: string,
    value: any,
}

export class BaseQuery<T>{
    public readonly key: string
    public readonly value: T

    constructor(key: string, value: T){
        this.key = key;
        this.value = value;
    }

    public get_sql_where_statement(): string{
        return `${this.key} = ?`;
    }

    public get_sql_placeholder_value(): T{
        return this.value;
    }

    public static get_key_value_set_from_query_string(query_string: string): KeyValueSet{
        const query = query_string.split("=");
        if(!query || query.length<2){
            throw new Error("クエリーがないか、キーか値が不足しています。");
        }
        if(query.length>2){
            throw new Error("キーと値の組み合わせが多いです。");
        }

        return {
            key: query[0],
            value: query[1]
        }
    }
}