import { SceneSystem } from '../system';
import type { SceneSystemOptions } from '../system';

interface TestDependencies {
  items: number[];
}

class TestSystem extends SceneSystem {
  constructor(options: SceneSystemOptions, dependencies?: TestDependencies) {
    super();
    void options;
    void dependencies;
  }
}
TestSystem.systemName = 'TestSystem';

class NoDepsSystem extends SceneSystem {
  constructor(options: SceneSystemOptions) {
    super();
    void options;
  }
}
NoDepsSystem.systemName = 'NoDepsSystem';

class NoConstructorSystem extends SceneSystem {}
NoConstructorSystem.systemName = 'NoConstructorSystem';

describe('System.with', () => {
  it('returns a binding and leaves the class untouched', () => {
    const keysBefore = Object.keys(TestSystem);
    const dependencies = { items: [1] };

    const binding = TestSystem.with(dependencies);

    expect(binding.system).toBe(TestSystem);
    expect(binding.dependencies).toBe(dependencies);
    expect(Object.keys(TestSystem)).toEqual(keysBefore);
  });

  it('checks the dependencies type against the system', () => {
    // @ts-expect-error items must be numbers
    TestSystem.with({ items: ['x'] });
    // @ts-expect-error the system declares no dependencies
    NoDepsSystem.with({});
    // @ts-expect-error a system without a constructor declares no dependencies
    NoConstructorSystem.with({ anything: 1 });
  });
});
