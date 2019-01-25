import { existsSync } from "fs";
import Container from "./container";

// @TODO: Include/Extend the Container
export class Application {
    /**
     * The current available container (if any).
     */
    private container: Container;

    /**
     * Indicates if the application has "booted".
     */
    private booted: boolean = false;

    /**
     * The application namespace.
     */
    private namespace: string;

    /**
     * Boot the application.
     */
    public boot(): void {
        this.getNamespace();

        this.bindPathsInContainer();

        this.booted = true;
    }

    /**
     * Get the version number of the application.
     */
    public version(): any {
        // @TODO
    }

    /**
     * Get the path to the data directory.
     */
    public dataPath(path: string = ""): string {
        return this.container.get("path.data").concat(path);
    }

    /**
     * Set the data directory.
     */
    public useDataPath(path: string): void {
        this.container.bind("path.data", path);
    }

    /**
     * Get the path to the config directory.
     */
    public configPath(path: string = ""): string {
        return this.container.get("path.config").concat(path);
    }

    /**
     * Set the config directory.
     */
    public useConfigPath(path: string): void {
        this.container.bind("path.config", path);
    }

    /**
     * Get the path to the cache directory.
     */
    public cachePath(path: string = ""): string {
        return this.container.get("path.cache").concat(path);
    }

    /**
     * Set the cache directory.
     */
    public useCachePath(path: string): void {
        this.container.bind("path.cache", path);
    }

    /**
     * Get the path to the log directory.
     */
    public logPath(path: string = ""): string {
        return this.container.get("path.log").concat(path);
    }

    /**
     * Set the log directory.
     */
    public useLogPath(path: string): void {
        this.container.bind("path.log", path);
    }

    /**
     * Get the path to the temp directory.
     */
    public tempPath(path: string = ""): string {
        return this.container.get("path.temp").concat(path);
    }

    /**
     * Set the temp directory.
     */
    public useTempPath(path: string): void {
        this.container.bind("path.temp", path);
    }

    /**
     * Get the environment file the application is using.
     */
    public environmentFile(): void {
        // @TODO
    }

    /**
     * Get the fully qualified path to the environment file.
     */
    public environmentFilePath(): void {
        // @TODO
    }

    /**
     * Get or check the current application environment.
     */
    public environment() {
        // @TODO
    }

    /**
     * Determine if application is in local environment.
     */
    public isLocal() {
        // @TODO
    }

    /**
     * Determine if the application is running tests.
     */
    public runningTests() {
        // @TODO
    }

    /**
     * Determine if the application has booted.
     */
    public isBooted() {
        return this.booted;
    }

    /**
     * Determine if the application configuration is cached.
     */
    public configurationIsCached(): boolean {
        return existsSync(this.getCachedConfigPath());
    }

    /**
     * Get the path to the configuration cache file.
     */
    public getCachedConfigPath(): string {
        return process.env.APP_CONFIG_CACHE || this.cachePath("config");
    }

    /**
     * Determine if the application is currently down for maintenance.
     */
    public isDownForMaintenance(): void {
        // @TODO
    }

    /**
     * Terminate the application.
     */
    public terminate(): void {
        // @TODO
    }

    /**
     * Bind all of the application paths in the container.
     */
    private bindPathsInContainer() {
        this.container.bind("path.data", this.dataPath());
        this.container.bind("path.config", this.configPath());
        this.container.bind("path.cache", this.cachePath());
        this.container.bind("path.log", this.logPath());
        this.container.bind("path.temp", this.tempPath());
    }

    /**
     * Get the application namespace.
     */
    private getNamespace() {
        if (this.namespace) {
            return this.namespace;
        }

        // @TODO

        if (!this.namespace) {
            throw new Error("Unable to detect application namespace.");
        }
    }
}
