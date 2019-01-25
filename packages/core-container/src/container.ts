import * as awilix from "awilix";
import {
    BindingAlreadyExists,
    BindingDoesNotExist,
    EntryAlreadyExists,
    EntryDoesNotExist,
    InstanceAlreadyExists,
} from "./errors";

interface IPlugin {
    getName(): string;
}

export class Container {
    /**
     * The current available container.
     */
    private container: awilix.AwilixContainer = awilix.createContainer();

    /**
     * The container's resolutions.
     */
    private resolved: Map<string, any>;

    /**
     * The container's bindings.
     */
    private bindings: Map<string, any>;

    /**
     * The container's method bindings.
     */
    private methodBindings: Map<string, any>;

    /**
     * The container's shared instances.
     */
    private instances: Map<string, any>;

    /**
     * The container's aliases.
     */
    private aliases: Map<string, any>;

    /**
     * Create a new container instance.
     */
    public constructor() {
        ["resolved", "bindings", "methodBindings", "instances", "aliases"].forEach(key => {
            this.container.register({ [key]: awilix.asValue(new Map()) });

            this[key] = this.container.resolve(key);
        });
    }

    /**
     * Get the container's resolutions.
     */
    public getResolved(): Map<string, any> {
        return this.resolved;
    }

    /**
     * Get the container's bindings.
     */
    public getBindings(): Map<string, any> {
        return this.bindings;
    }

    /**
     * Get the container's method bindings.
     */
    public getMethodBindings(): Map<string, any> {
        return this.methodBindings;
    }

    /**
     * Get the container's instances.
     */
    public getInstances(): Map<string, any> {
        return this.instances;
    }

    /**
     * Get the container's aliases.
     */
    public getAliases(): Map<string, any> {
        return this.aliases;
    }

    /**
     * Determine if the container has any binding.
     */
    public bound(key: string): boolean {
        try {
            this.resolve(key);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Determine if the given abstract type has been bound.
     */
    public has(key: string): boolean {
        return this.bound(key);
    }

    /**
     * Determine if the container has resolved the value.
     */
    public hasResolved(key: string): boolean {
        return this.resolved.has(key);
    }

    /**
     * Determine if the container has a classic binding.
     */
    public hasBinding(key: string): boolean {
        return this.bindings.has(key);
    }

    /**
     * Determine if the container has a method binding.
     */
    public hasMethodBinding(key: string): boolean {
        return this.methodBindings.has(key);
    }

    /**
     * Determine if the container has an instance binding.
     */
    public hasInstance(key: string): boolean {
        return this.instances.has(key);
    }

    /**
     * Determine if the container has an alias binding.
     */
    public hasAlias(key: string): boolean {
        return this.aliases.has(key);
    }

    /**
     * Determine if the given abstract type has been resolved.
     */
    public isResolved(key: string): boolean {
        if (this.isAlias(key)) {
            key = this.getAlias(key);
        }

        return this.hasResolved("key") || !!this.instances[key];
    }

    /**
     * Determine if a given string is an alias.
     */
    public isAlias(key: string): boolean {
        return this.hasAlias(key);
    }

    /**
     * Register a binding with the container.
     */
    public register(key: string, value: any): void {
        if (this.has(key)) {
            throw new EntryAlreadyExists(key);
        }

        this.container.register(key, awilix.asValue(value));
    }

    /**
     * Register a binding with the container.
     */
    public bind(key: string, value: any, shared: boolean = false, overwrite: boolean = false): void {
        if (this.hasBinding(key) && !overwrite) {
            throw new BindingAlreadyExists(key);
        }

        if (shared) {
            value = value.singleton();
        }

        this.bindings.set(key, value);
    }

    /**
     * Register a binding if it hasn't already been registered.
     */
    public bindIf(key: string, concrete: any): void {
        if (!this.hasBinding(key)) {
            this.bind(key, concrete);
        }
    }

    /**
     * Bind a callback to resolve with Container::call.
     */
    public bindMethod(method: string, callback: any): void {
        this.methodBindings.set(method, callback);
    }

    /**
     * Get the method binding for the given method.
     */
    public callMethodBinding(method: string, parameters: any): any {
        return this.methodBindings.get(method)(this, parameters);
    }

    /**
     * Register a shared binding in the container.
     */
    public singleton(key: string, concrete: any): void {
        this.bind(key, awilix.asClass(concrete), true);
    }

    /**
     * Register an existing instance as shared in the container.
     */
    public instance(key: string, value: any, overwrite: boolean = false): void {
        if (this.instances.has(key) && !overwrite) {
            throw new InstanceAlreadyExists(key);
        }

        this.instances.set(key, value);
    }

    /**
     * Alias a type to a different name.
     */
    public alias(key: string, value: any) {
        this.aliases.set(key, value);
    }

    /**
     * Call the given plugin or method and inject the container.
     */
    public call(callback: CallableFunction, parameters: Record<string, any> = []) {
        // @TODO
    }

    /**
     * Get a closure to resolve the given type from the container.
     */
    public factory(key: string): any {
        return this.make(key);
    }

    /**
     * An alias function name for make().
     */
    public makeWith(key: string, parameters: Record<string, any> = []): any {
        return this.make(key, parameters);
    }

    /**
     * Resolve the given type from the container.
     */
    public make(key: string, parameters: Record<string, any> = []): any {
        return this.resolve(key);
    }

    /**
     * Resolve the given type from the container.
     */
    public get(key: string): any {
        try {
            return this.resolve(key);
        } catch (error) {
            if (this.has(key)) {
                throw error;
            }

            throw new BindingDoesNotExist(key);
        }
    }

    /**
     * Instantiate a concrete instance of the given type.
     */
    public build(plugin: IPlugin): any {
        // @TODO
    }

    /**
     * Get the alias for an abstract if available.
     */
    public getAlias(key: string): string {
        if (!this.hasAlias(key)) {
            return key;
        }

        const alias = this.getAlias(key);

        if (alias === key) {
            throw new Error(`[${key}] is aliased to itself.`);
        }

        return this.getAlias(alias);
    }

    /**
     * Remove a resolved instance from the instance cache.
     */
    public forgetInstance(key: string): void {
        this.instances.delete(key);
    }

    /**
     * Clear all of the instances from the container.
     */
    public forgetInstances(): void {
        this.instances = new Map();
    }

    /**
     * Flush the container of all bindings and resolved instances.
     */
    public flush(): void {
        this.aliases = new Map();
        this.resolved = new Map();
        this.bindings = new Map();
        this.methodBindings = new Map();
        this.instances = new Map();
    }

    /**
     * Resolve the given type from the container.
     */
    private resolve<T = any>(key: string): T {
        try {
            return this.container.resolve<T>(key);
        } catch (err) {
            throw new EntryDoesNotExist(err.message);
        }
    }

    /**
     * Get the concrete type for a given abstract.
     */
    private getConcrete(key: string): any {
        // @TODO
    }

    /**
     * Determine if the given concrete is buildable.
     */
    private isBuildable(plugin: IPlugin): any {
        // @TODO
    }

    /**
     * Drop all of the stale instances and aliases.
     */
    private dropStaleInstances(key: string): void {
        this.instances.delete(key);
        this.aliases.delete(key);
    }
}
