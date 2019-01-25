import { CustomError } from "./custom-error";

export class BindingDoesNotExist extends CustomError {
    constructor(value: string) {
        super(`[${value}] is not a registered binding.`);
    }
}
