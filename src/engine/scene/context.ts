// comment: There can be any constructor signature
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export class SceneContext {
  name: string;
  data: Record<string, unknown>;

  private services: Record<string, unknown>;

  constructor(name: string) {
    this.name = name;
    this.data = {};
    this.services = {};
  }

  registerService(service: object): void {
    this.services[service.constructor.name] = service;
  }

  deleteService<T>(serviceClass: Constructor<T>): void {
    delete this.services[serviceClass.name];
  }

  getService<T>(serviceClass: Constructor<T>): T {
    if (this.services[serviceClass.name] === undefined) {
      throw new Error(`Can't find service with the following name: ${serviceClass.name}`);
    }

    return this.services[serviceClass.name] as T;
  }
}
