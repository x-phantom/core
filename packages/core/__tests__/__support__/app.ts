import { resolve } from "path";

export const opts = {
    data: "~/.core",
    config: resolve(__dirname, "./config"),
    token: "swapblocks",
    network: "testnet",
    skipPlugins: true,
};

export const version = "2.0.0";
