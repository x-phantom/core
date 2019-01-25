import { CustomError } from "./custom-error";

export class EntryDoesNotExist extends CustomError {
    constructor(value: string) {
        super(`[${value}] is not registered.`);
    }
}
