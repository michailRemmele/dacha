import type { Component } from '../component';

export class Prefab {
  private name: string;
  private components: Record<string, Component>;
  private parent?: Prefab;
  private children: Array<Prefab>;
  private type: string;

  constructor() {
    this.name = '';
    this.components = {};
    this.parent = void 0;
    this.children = [];
    this.type = '';
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setParent(parent: Prefab): void {
    this.parent = parent;
  }

  getParent(): Prefab | undefined {
    return this.parent;
  }

  appendChild(child: Prefab): void {
    this.children.push(child);
  }

  getChildren(): Array<Prefab> {
    return this.children;
  }

  setComponent(name: string, component: Component): void {
    this.components[name] = component;
  }

  getComponent(name: string): Component | undefined {
    return this.components[name];
  }

  getAvailableComponents(): Array<string> {
    return Object.keys(this.components);
  }

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }

  clone(): Prefab {
    const prefab = new Prefab();

    prefab.setName(this.name);
    prefab.setType(this.type);

    this.children.forEach((child) => {
      const childPrefab = child.clone();
      childPrefab.setParent(prefab);
      prefab.appendChild(childPrefab);
    });

    Object.keys(this.components).forEach((name) => {
      prefab.setComponent(name, this.components[name].clone());
    });

    return prefab;
  }
}
