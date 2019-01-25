import { CustomError } from "./custom-error";

export class EntryAlreadyExists extends CustomError {
    constructor(value: string) {
        super(`[${value}] is not registered.`);
    }
}
