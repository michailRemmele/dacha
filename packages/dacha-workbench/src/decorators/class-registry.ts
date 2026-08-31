import { type BehaviorConstructor } from '../types/engine';

class ClassRegistry {
  private registry: Map<string, Map<string, BehaviorConstructor>>;

  constructor() {
    this.registry = new Map();
  }

  addClass(
    groupName: string,
    className: string,
    classDefinition: BehaviorConstructor,
  ): void {
    if (!this.registry.has(groupName)) {
      this.registry.set(groupName, new Map());
    }

    const group = this.registry.get(groupName);
    group?.set(className, classDefinition);
  }

  getClass(
    groupName: string,
    className: string,
  ): BehaviorConstructor | undefined {
    return this.registry.get(groupName)?.get(className);
  }

  getGroup<T extends BehaviorConstructor = BehaviorConstructor>(
    groupName: string,
  ): T[] | undefined {
    return this.registry.has(groupName)
      ? (Array.from(this.registry.get(groupName)!.values()) as T[])
      : undefined;
  }

  clear(): void {
    this.registry.clear();
  }
}

export const classRegistry = new ClassRegistry();
