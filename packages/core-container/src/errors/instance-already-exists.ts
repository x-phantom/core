import { CustomError } from "./custom-error";

export class InstanceAlreadyExists extends CustomError {
    constructor(value: string) {
        super(`[${value}] is already registered.`);
    }
}
