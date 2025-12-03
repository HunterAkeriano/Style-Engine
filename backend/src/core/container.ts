type Factory<T> = (container: Container) => T

/**
 * Lightweight service container to wire dependencies without a heavy DI framework.
 * Supports lazy singleton factories and simple value registrations.
 */
export class Container {
  private readonly singletons = new Map<string, unknown>()
  private readonly factories = new Map<string, Factory<unknown>>()

  registerValue<T>(token: string, value: T) {
    this.singletons.set(token, value)
  }

  registerFactory<T>(token: string, factory: Factory<T>) {
    this.factories.set(token, factory)
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T
    }

    const factory = this.factories.get(token)
    if (!factory) {
      throw new Error(`No provider registered for token "${token}"`)
    }

    const instance = factory(this)
    this.singletons.set(token, instance)
    return instance as T
  }
}
