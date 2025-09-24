import { type Component, type System } from 'dacha';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export type ComponentConstructor<T extends Component = Component> =
  Constructor<T> & {
    componentName: string;
  };

export type SystemConstructor<T extends System = System> = Constructor<T> & {
  systemName: string;
};

export type BehaviorConstructor<T = unknown> = Constructor<T> & {
  behaviorName: string;
};
