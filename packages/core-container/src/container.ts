import { getNamespace } from "continuation-local-storage";

interface IPlugin {
    getName(): string;
}

export class Container {
    /**
     * An array of the types that have been resolved.
     */
    private resolved: Record<string, any> = [];

    /**
     * The container's bindings.
     */
    private bindings: Record<string, any> = [];

    /**
     * The container's method bindings.
     */
    private methodBindings: Record<string, any> = [];

    /**
     * The container's shared instances.
     */
    private instances: Record<string, any> = [];

    /**
     * The registered type aliases.
     *
     * @var array
     */
    private aliases: Record<string, any> = [];

    /**
     * Determine if the given abstract type has been bound.
     */
    public bound(key: string): boolean {
        return !!this.bindings[key] || !!this.instances[key] || this.isAlias(key);
    }

    /**
     * Determine if the given abstract type has been bound.
     */
    public has(key: string): boolean {
        return this.bound(key);
    }

    /**
     * Determine if the given abstract type has been resolved.
     */
    public isResolved(key: string): boolean {
        if (this.isAlias(key)) {
            key = this.getAlias(key);
        }

        return !!this.resolved[key] || !!this.instances[key];
    }

    /**
     * Determine if a given string is an alias.
     */
    public isAlias(key: string): boolean {
        return !!this.aliases[key];
    }

    /**
     * Register a binding with the container.
     */
    public bind(key: string, concrete: IPlugin | CallableFunction, shared: boolean = false): void {
        // @TODO
    }

    /**
     * Determine if the container has a method binding.
     */
    public hasMethodBinding(key: string): boolean {
        return !!this.methodBindings[key];
    }

    /**
     * Bind a callback to resolve with Container::call.
     */
    public bindMethod(method: string, callback: any): void {
        this.methodBindings[method] = callback;
    }

    /**
     * Get the method binding for the given method.
     */
    public callMethodBinding(method: string, parameters: any): any {
        return this.methodBindings[method](this, parameters);
    }

    /**
     * Register a binding if it hasn't already been registered.
     */
    public bindIf(key: string, concrete: IPlugin): void {
        if (!this.bound(key)) {
            this.bind(key, concrete);
        }
    }

    /**
     * Register a shared binding in the container.
     */
    public singleton(key: string, concrete: IPlugin): void {
        this.bind(key, concrete, true);
    }

    /**
     * Register an existing instance as shared in the container.
     */
    public instance(key: string, instance: any): void {
        // @TODO
    }

    /**
     * Alias a type to a different name.
     */
    public alias(abstract, alias) {
        this.aliases[alias] = abstract;
    }

    /**
     * Call the given Closure / class@method and inject its dependencies.
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
        return this.resolve(key, parameters);
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

            throw new Error(`[${key}] is not registered.`);
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
        if (!this.aliases[key]) {
            return key;
        }

        if (this.aliases[key] === key) {
            throw new Error(`[${key}] is aliased to itself.`);
        }

        return this.getAlias(this.aliases[key]);
    }

    /**
     * Remove a resolved instance from the instance cache.
     */
    public forgetInstance(key: string): void {
        delete this.instances[key];
    }

    /**
     * Clear all of the instances from the container.
     */
    public forgetInstances(): void {
        this.instances = [];
    }

    /**
     * Flush the container of all bindings and resolved instances.
     */
    public flush(): void {
        this.aliases = [];
        this.resolved = [];
        this.bindings = [];
        this.methodBindings = [];
        this.instances = [];
    }

    /**
     * Resolve the given type from the container.
     */
    protected resolve(key: string, parameters: Record<string, any> = []): any {
        // @TODO
    }

    /**
     * Get the concrete type for a given abstract.
     */
    protected getConcrete(abstract): any {
        // @TODO
    }

    /**
     * Determine if the given concrete is buildable.
     */
    protected isBuildable(plugin: IPlugin): any {
        // @TODO
    }

    /**
     * Drop all of the stale instances and aliases.
     */
    protected dropStaleInstances(key: string): void {
        delete this.instances[key];
        delete this.aliases[key];
    }
}
