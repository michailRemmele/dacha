import 'reflect-metadata';
import type { Component, Actor } from 'dacha';

import { schemaRegistry } from '../schema-registry';
import { DefineComponent } from '../define-component';
import { DefineField } from '../define-field';

class TestComponent {
  static componentName: string;

  actor?: Actor;

  getParentComponent(): Component | undefined {
    return undefined;
  }
}

describe('DefineComponent — schema sections', () => {
  beforeEach(() => {
    (window as unknown as { DachaWorkbench: unknown }).DachaWorkbench = {};
    schemaRegistry.clear();
  });
  afterEach(() => {
    delete (window as unknown as { DachaWorkbench?: unknown }).DachaWorkbench;
  });

  it('carries a field-level "section" option through to the registered schema', () => {
    @DefineComponent({ name: 'rigidBody' })
    class RigidBody extends TestComponent {
      @DefineField({ type: 'string' }) type = 'static';
      @DefineField({ type: 'number', section: 'Dynamics' }) mass = 1;
    }
    void RigidBody;

    expect(schemaRegistry.getWidget('component', 'rigidBody')?.fields).toEqual([
      { name: 'type', type: 'string' },
      { name: 'mass', type: 'number', section: 'Dynamics' },
    ]);
  });

  it('carries the widget-level "sections" defaultOpen map through to the registered schema', () => {
    @DefineComponent({
      name: 'rigidBody',
      sections: { Dynamics: { defaultOpen: true } },
    })
    class RigidBody extends TestComponent {
      @DefineField({ type: 'number', section: 'Dynamics' }) mass = 1;
    }
    void RigidBody;

    expect(
      schemaRegistry.getWidget('component', 'rigidBody')?.sections,
    ).toEqual({
      Dynamics: { defaultOpen: true },
    });
  });
});
