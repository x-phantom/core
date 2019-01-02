import { flags } from "@oclif/command";
import bip39 from "bip39";
import fs from "fs-extra";
import prompts from "prompts";
import { BaseCommand } from "../../command";

export class BIP39Command extends BaseCommand {
    public static description: string = "Configure the forging delegate (BIP38)";

    public static examples: string[] = [
        `Configure a delegate using a BIP39 passphrase
$ ark config:forger:bip39 --bip39="..."
`,
    ];

    public static flags: Record<string, any> = {
        bip39: flags.string({
            char: "b",
            description: "the plain text bip39 passphrase",
            required: true,
        }),
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(BIP39Command);

        if (flags.bip39) {
            return this.performConfiguration(flags);
        }

        // Interactive CLI
        const response = await prompts([
            {
                type: "password",
                name: "bip39",
                message: "Please enter your delegate passphrase",
                validate: value =>
                    !bip39.validateMnemonic(value) ? `Failed to verify the given passphrase as BIP39 compliant.` : true,
            },
            {
                type: "confirm",
                name: "confirm",
                message: "Can you confirm?",
                initial: true,
            },
        ]);

        if (response.confirm) {
            return this.performConfiguration({ ...flags, ...response });
        }
    }

    private async performConfiguration(flags): Promise<void> {
        const delegatesConfig = `${flags.config}/delegates.json`;

        this.addTask("Prepare configuration", async () => {
            if (!fs.existsSync(delegatesConfig)) {
                throw new Error(`Couldn't find the core configuration at ${delegatesConfig}.`);
            }
        });

        this.addTask("Validate passphrase", async () => {
            if (!bip39.validateMnemonic(flags.bip39)) {
                throw new Error(`Failed to verify the given passphrase as BIP39 compliant.`);
            }
        });

        this.addTask("Write BIP39 to configuration", async () => {
            const delegates = require(delegatesConfig);
            delegates.secrets = [flags.bip39];
            delete delegates.bip38;

            fs.writeFileSync(delegatesConfig, JSON.stringify(delegates, null, 2));
        });

        await this.runTasks();
    }
}
