import { CustomError } from "./custom-error";

export class BindingAlreadyExists extends CustomError {
    constructor(value: string) {
        super(`[${value}] is already registered.`);
    }
}
