export class FormatError extends Error{
    public readonly bad_points: string[] = [];

    constructor(message: string, bad_points: string[]) {
        super(message);
        this.bad_points.push(...bad_points)
    }
}