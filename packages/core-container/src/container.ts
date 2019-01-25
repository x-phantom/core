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

// @TODO: make use of mixins for each type of binding

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
     * Get a resolved instance from the container container.
     */
    public getResolve<T = any>(abstract: string): T {
        return this.resolved.get(abstract);
    }

    /**
     * Get a binding from the container container.
     */
    public getBinding<T = any>(abstract: string): T {
        return this.bindings.get(abstract);
    }

    /**
     * Get a method binding from the container container.
     */
    public getMethodBinding<T = any>(abstract: string): T {
        return this.methodBindings.get(abstract);
    }

    /**
     * Get an instance binding from the container container.
     */
    public getInstance<T = any>(abstract: string): T {
        return this.instances.get(abstract);
    }

    /**
     * Get the alias for an abstract if available.
     */
    public getAlias(abstract: string): string {
        if (!this.hasAlias(abstract)) {
            return abstract;
        }

        const alias = this.aliases.get(abstract);

        if (alias === abstract) {
            throw new Error(`[${abstract}] is aliased to itself.`);
        }

        return alias;
    }

    /**
     * Determine if the container has any binding.
     */
    public bound(abstract: string): boolean {
        try {
            this.resolve(abstract);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Determine if the given abstract type has been bound.
     */
    public has(abstract: string): boolean {
        return this.bound(abstract);
    }

    /**
     * Determine if the container has resolved the value.
     */
    public hasResolved(abstract: string): boolean {
        return this.resolved.has(abstract);
    }

    /**
     * Determine if the container has a classic binding.
     */
    public hasBinding(abstract: string): boolean {
        return this.bindings.has(abstract);
    }

    /**
     * Determine if the container has a method binding.
     */
    public hasMethodBinding(abstract: string): boolean {
        return this.methodBindings.has(abstract);
    }

    /**
     * Determine if the container has an instance binding.
     */
    public hasInstance(abstract: string): boolean {
        return this.instances.has(abstract);
    }

    /**
     * Determine if the container has an alias binding.
     */
    public hasAlias(abstract: string): boolean {
        return this.aliases.has(abstract);
    }

    /**
     * Determine if the given abstract type has been resolved.
     */
    public isResolved(abstract: string): boolean {
        if (this.isAlias(abstract)) {
            abstract = this.getAlias(abstract);
        }

        return this.hasResolved(abstract) || this.hasInstance(abstract);
    }

    /**
     * Determine if a given type is shared.
     */
    public isShared(abstract: string): boolean {
        if (this.hasInstance(abstract)) {
            return true;
        }

        const binding = this.bindings.get(abstract);

        return binding && binding.shared && binding.shared === true;
    }

    /**
     * Determine if a given string is an alias.
     */
    public isAlias(abstract: string): boolean {
        return this.hasAlias(abstract);
    }

    /**
     * Register a binding with the container.
     */
    public register(abstract: string, value: any): void {
        if (this.has(abstract)) {
            throw new EntryAlreadyExists(abstract);
        }

        this.container.register(abstract, awilix.asValue(value));
    }

    /**
     * Register a binding with the container.
     */
    public bind(abstract: string, concrete: any, shared: boolean = false, overwrite: boolean = false): void {
        if (this.hasBinding(abstract) && !overwrite) {
            throw new BindingAlreadyExists(abstract);
        }

        if (shared) {
            concrete = concrete.singleton();
        }

        if (this.isResolved(abstract)) {
            // @TODO
        }

        this.bindings.set(abstract, { concrete, shared });
    }

    /**
     * Register a binding if it hasn't already been registered.
     */
    public bindIf(abstract: string, concrete: any): void {
        if (!this.hasBinding(abstract)) {
            this.bind(abstract, concrete);
        }
    }

    /**
     * Bind a callback to resolve with call.
     */
    public bindMethod(name: string, method: any): void {
        this.methodBindings.set(name, method);
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
    public singleton(abstract: string, concrete: any): void {
        this.bind(abstract, awilix.asClass(concrete), true);
    }

    /**
     * Register an existing instance as shared in the container.
     */
    public instance(abstract: string, concrete: any, overwrite: boolean = false): void {
        if (this.instances.has(abstract) && !overwrite) {
            throw new InstanceAlreadyExists(abstract);
        }

        this.instances.set(abstract, concrete);
    }

    /**
     * Alias a type to a different name.
     */
    public alias(abstract: string, alias: string) {
        this.aliases.set(alias, abstract);

        this.container.register({ [alias]: awilix.aliasTo(abstract) });
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
    public factory(abstract: string): any {
        return this.make(abstract);
    }

    /**
     * An alias function name for make().
     */
    public makeWith(abstract: string, parameters: Record<string, any> = []): any {
        return this.make(abstract, parameters);
    }

    /**
     * Resolve the given type from the container.
     */
    public make(abstract: string, parameters: Record<string, any> = []): any {
        return this.resolve(abstract);
    }

    /**
     * Resolve the given type from the container.
     */
    public get(abstract: string): any {
        try {
            return this.resolve(abstract);
        } catch (error) {
            if (this.has(abstract)) {
                throw error;
            }

            throw new BindingDoesNotExist(abstract);
        }
    }

    /**
     * Instantiate a concrete instance of the given type.
     */
    public build(plugin: IPlugin): any {
        // @TODO
    }

    /**
     * Remove a value from the resolved cache.
     */
    public forgetResolved(abstract: string): void {
        this.resolved.delete(abstract);
    }

    /**
     * Remove a value from the binding cache.
     */
    public forgetBinding(abstract: string): void {
        this.bindings.delete(abstract);
    }

    /**
     * Remove a value from the method binding cache.
     */
    public forgetMethodBinding(abstract: string): void {
        this.methodBindings.delete(abstract);
    }

    /**
     * Remove a value from the instance cache.
     */
    public forgetInstance(abstract: string): void {
        this.instances.delete(abstract);
    }

    /**
     * Remove a value from the alias cache.
     */
    public forgetAlias(abstract: string): void {
        this.aliases.delete(abstract);
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
     * Clear all resolved instances from the container.
     */
    public flushResolved(): void {
        this.resolved.clear();
    }

    /**
     * Clear all bindings from the container.
     */
    public flushBindings(): void {
        this.bindings.clear();
    }

    /**
     * Clear all method bindings from the container.
     */
    public flushMethodBindings(): void {
        this.methodBindings.clear();
    }

    /**
     * Clear all instances from the container.
     */
    public flushInstances(): void {
        this.instances.clear();
    }

    /**
     * Clear all aliases from the container.
     */
    public flushAliases(): void {
        this.aliases.clear();
    }

    /**
     * Drop all of the stale instances and aliases.
     */
    public dropStaleInstances(abstract: string): void {
        this.instances.delete(abstract);
        this.aliases.delete(abstract);
    }

    /**
     * Resolve the given type from the container.
     */
    private resolve<T = any>(abstract: string): T {
        try {
            abstract = this.getAlias(abstract);

            // @TODO: return early if we already resolved the value once

            let concrete = this.getConcrete(abstract);
            concrete = this.isBuildable(concrete, abstract) ? this.build(concrete) : this.make(concrete);

            if (this.isShared(abstract)) {
                this.instances.set(abstract, abstract);
            }

            concrete = this.container.resolve<T>(abstract);

            this.resolved.set(abstract, true);

            return concrete;
        } catch (err) {
            throw new EntryDoesNotExist(err.message);
        }
    }

    /**
     * Get the concrete type for a given abstract.
     */
    private getConcrete(abstract: string): any {
        return this.hasBinding(abstract) ? this.getBinding(abstract).concrete : abstract;
    }

    /**
     * Determine if the given concrete is buildable.
     */
    private isBuildable(concrete: any, abstract: any): boolean {
        return concrete === abstract;
    }
}
