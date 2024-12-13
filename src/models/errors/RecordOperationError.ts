export const RecordOperationErrorCodes = {
    CANNOT_GET_RECORD: 1001,
    NOT_FOUND_RECORD: 1002,

    DUPLICATE_PRIMARY_KEY: 2001,
    DUPLICATE_UNIQUE_KEY: 2002,
} as const;
export type RecordOperationErrorCodes = (typeof RecordOperationErrorCodes)[keyof typeof RecordOperationErrorCodes];

export class RecordOperationError extends Error{
    public readonly table: string;
    public readonly code: RecordOperationErrorCodes;

    constructor(message: string, table: string, code: RecordOperationErrorCodes) {
        super(message);
        this.table = table;
        this.code = code;
    }
}