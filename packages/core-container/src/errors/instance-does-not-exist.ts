import { CustomError } from "./custom-error";

export class InstanceDoesNotExist extends CustomError {
    constructor(value: string) {
        super(`[${value}] is not a registered instance.`);
    }
}
