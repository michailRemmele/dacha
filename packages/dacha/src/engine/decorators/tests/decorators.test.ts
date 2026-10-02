import { Component } from '../../component';
import { WorldSystem } from '../../system';
import {
  DefineComponent,
  DefineSystem,
  DefineAsset,
  DefineBehavior,
  DefineField,
  getSchema,
} from '..';
import {
  DefineShader,
  DefineFilterEffect,
} from '../../../contrib/systems/renderer/decorators';

describe('DefineField type inference', () => {
  it('uses the explicit type, then initialValue, then string', () => {
    @DefineComponent({ name: 'Infer' })
    class Infer extends Component {
      @DefineField({ type: 'range', min: 0, max: 1 }) volume!: number;
      @DefineField({ initialValue: 10 }) speed!: number;
      @DefineField({ initialValue: 'a' }) label!: string;
      @DefineField({ initialValue: true }) on!: boolean;
      @DefineField({ initialValue: { x: 1, y: 2 } }) offset!: {
        x: number;
        y: number;
      };
      @DefineField() plain!: string;
    }

    expect(getSchema(Infer)?.fields).toEqual([
      { name: 'volume', type: 'range', min: 0, max: 1 },
      { name: 'speed', type: 'number', initialValue: 10 },
      { name: 'label', type: 'string', initialValue: 'a' },
      { name: 'on', type: 'boolean', initialValue: true },
      { name: 'offset', type: 'vector', initialValue: { x: 1, y: 2 } },
      { name: 'plain', type: 'string' },
    ]);
  });

  it('keeps a name override', () => {
    @DefineComponent({ name: 'Renamed' })
    class Renamed extends Component {
      @DefineField({ name: 'other' }) value!: string;
    }

    expect(getSchema(Renamed)?.fields).toEqual([
      { name: 'other', type: 'string' },
    ]);
  });

  it('rejects static, private and symbol members', () => {
    const key = Symbol('key');

    expect(() => {
      class Static extends Component {
        @DefineField() static label: string;
      }
      return Static;
    }).toThrow('DefineField');
    expect(() => {
      class Private extends Component {
        @DefineField() #label = '';

        get label(): string {
          return this.#label;
        }
      }
      return Private;
    }).toThrow('DefineField');
    expect(() => {
      class Keyed extends Component {
        @DefineField() [key]!: string;
      }
      return Keyed;
    }).toThrow('DefineField');
  });
});

describe('class decorators', () => {
  it('sets the static name and a schema with the widget options', () => {
    @DefineComponent({
      name: 'Health',
      icon: 'Heart',
      title: 'health.title',
      sections: { a: { defaultOpen: true } },
    })
    class Health extends Component {
      @DefineField({ initialValue: 1, section: 'a' }) points!: number;
    }

    expect(Health.componentName).toBe('Health');
    expect(getSchema(Health)).toEqual({
      kind: 'component',
      name: 'Health',
      icon: 'Heart',
      title: 'health.title',
      sections: { a: { defaultOpen: true } },
      fields: [
        { name: 'points', type: 'number', initialValue: 1, section: 'a' },
      ],
    });
  });

  it('makes the static name non-writable', () => {
    @DefineComponent({ name: 'Fixed' })
    class Fixed extends Component {}

    expect(() => {
      (Fixed as { componentName: string }).componentName = 'Other';
    }).toThrow(TypeError);
  });

  it('keeps fields from the options, in order and with duplicate names', () => {
    @DefineSystem({
      name: 'Opts',
      fields: [
        { name: 'radius', type: 'number', initialValue: 5 },
        { name: 'radius', type: 'vector', initialValue: { x: 5, y: 5 } },
      ],
    })
    class Opts extends WorldSystem {}

    expect(Opts.systemName).toBe('Opts');
    expect(getSchema(Opts)?.kind).toBe('system');
    expect(getSchema(Opts)?.fields.map((f) => f.type)).toEqual([
      'number',
      'vector',
    ]);
  });

  it('lets a decorated field replace an option field with the same name', () => {
    @DefineComponent({
      name: 'Merge',
      fields: [
        { name: 'a', type: 'string' },
        { name: 'b', type: 'string' },
      ],
    })
    class Merge extends Component {
      @DefineField({ initialValue: 1 }) a!: number;
      @DefineField({ initialValue: true }) c!: boolean;
    }

    expect(getSchema(Merge)?.fields).toEqual([
      { name: 'a', type: 'number', initialValue: 1 },
      { name: 'b', type: 'string' },
      { name: 'c', type: 'boolean', initialValue: true },
    ]);
  });

  it('records assets and behaviors with their kind', () => {
    @DefineAsset({
      name: 'sound',
      fields: [{ name: 'src', type: 'file', extensions: ['mp3'] }],
    })
    class Sound {}
    @DefineBehavior({ name: 'Patrol' })
    class Patrol {}

    expect((Sound as unknown as { assetName: string }).assetName).toBe('sound');
    expect(getSchema(Sound)).toMatchObject({ kind: 'asset', name: 'sound' });
    expect((Patrol as unknown as { behaviorName: string }).behaviorName).toBe(
      'Patrol',
    );
    expect(getSchema(Patrol)).toMatchObject({
      kind: 'behavior',
      name: 'Patrol',
    });
    expect(getSchema(Patrol)).not.toHaveProperty('type');
  });
});

describe('inheritance', () => {
  @DefineComponent({ name: 'Base' })
  class Base extends Component {
    @DefineField({ initialValue: 1 }) a!: number;
  }

  it('gives a decorated subclass its parent fields without changing the parent', () => {
    @DefineComponent({ name: 'Child' })
    class Child extends Base {
      @DefineField({ initialValue: true }) b!: boolean;
    }

    expect(getSchema(Child)?.fields.map((f) => f.name)).toEqual(['a', 'b']);
    expect(getSchema(Base)?.fields.map((f) => f.name)).toEqual(['a']);
  });

  it('returns no schema for an undecorated subclass', () => {
    class Plain extends Base {}
    class FieldsOnly extends Base {
      @DefineField({ initialValue: 2 }) c!: number;
    }

    expect(getSchema(Plain)).toBeUndefined();
    expect(getSchema(FieldsOnly)).toBeUndefined();
  });
});

describe('getSchema', () => {
  it.each([undefined, null, 1, 'x', {}, (): undefined => undefined, class {}])(
    'returns undefined for %p',
    (value): void => {
      expect(getSchema(value)).toBeUndefined();
    },
  );
});

describe('field semantics', () => {
  it('lets the constructor assignment win over the decorated field', () => {
    @DefineComponent({ name: 'Ctor' })
    class Ctor extends Component {
      @DefineField({ initialValue: 10 }) speed: number;
      constructor(config: { speed: number }) {
        super();
        this.speed = config.speed;
      }
    }

    expect(new Ctor({ speed: 5 }).speed).toBe(5);
  });
});

describe('renderer decorators', () => {
  it('gives shaders and filter effects their own kind and static name', () => {
    @DefineShader({ name: 'Wave' })
    class Wave {}
    @DefineFilterEffect({ name: 'Blur' })
    class Blur {}

    expect(getSchema(Wave)).toMatchObject({ kind: 'shader', name: 'Wave' });
    expect(getSchema(Blur)).toMatchObject({
      kind: 'filterEffect',
      name: 'Blur',
    });
    expect((Wave as unknown as { shaderName: string }).shaderName).toBe('Wave');
    expect(
      (Blur as unknown as { filterEffectName: string }).filterEffectName,
    ).toBe('Blur');
    expect(Wave).not.toHaveProperty('behaviorName');
    expect(Blur).not.toHaveProperty('behaviorName');
    expect(getSchema(Wave)).not.toHaveProperty('type');
  });
});

describe('inheritance from a class that declares fields in the options', () => {
  it('gives a decorated subclass the fields from the parent decorator options', () => {
    @DefineComponent({
      name: 'OptionsParent',
      fields: [
        { name: 'a', type: 'number', initialValue: 1 },
        { name: 'b', type: 'string' },
      ],
    })
    class OptionsParent extends Component {}

    @DefineComponent({ name: 'OptionsChild' })
    class OptionsChild extends OptionsParent {
      @DefineField({ initialValue: true }) extra!: boolean;
    }

    expect(getSchema(OptionsChild)?.fields.map((f) => f.name)).toEqual([
      'a',
      'b',
      'extra',
    ]);
    expect(getSchema(OptionsParent)?.fields.map((f) => f.name)).toEqual([
      'a',
      'b',
    ]);
  });
});

describe('field order', () => {
  it('follows the source order across fields, getters, setters and accessors', () => {
    @DefineComponent({ name: 'Mixed' })
    class Mixed extends Component {
      private _b = 1;

      @DefineField({ initialValue: 'a' }) a!: string;

      @DefineField({ initialValue: 1 })
      get b(): number {
        return this._b;
      }
      set b(value: number) {
        this._b = value;
      }

      @DefineField({ initialValue: true }) c!: boolean;

      @DefineField({ initialValue: 2 }) accessor d = 2;

      @DefineField({ type: 'number' })
      set e(value: number) {
        this._b = value;
      }
    }

    expect(getSchema(Mixed)?.fields.map((f) => f.name)).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
    ]);
  });

  it('keeps inherited fields before the subclass fields', () => {
    @DefineComponent({ name: 'OrderParent' })
    class OrderParent extends Component {
      protected value = 1;

      @DefineField({ initialValue: 1 })
      get p(): number {
        return this.value;
      }
      @DefineField({ initialValue: 'q' }) q!: string;
    }

    @DefineComponent({ name: 'OrderChild' })
    class OrderChild extends OrderParent {
      @DefineField({ initialValue: true }) r!: boolean;
      @DefineField({ initialValue: 2 })
      get s(): number {
        return this.value + 1;
      }
    }

    expect(getSchema(OrderChild)?.fields.map((f) => f.name)).toEqual([
      'p',
      'q',
      'r',
      's',
    ]);
  });
});

describe('data fields', () => {
  it('accept an initialValue that differs from the member type', () => {
    @DefineComponent({ name: 'DataHolder' })
    class DataHolder extends Component {
      @DefineField({ type: 'data', initialValue: [] })
      bindings!: Record<string, number>;
    }

    expect(getSchema(DataHolder)?.fields).toEqual([
      { name: 'bindings', type: 'data', initialValue: [] },
    ]);
  });
});

describe('script fields', () => {
  it('stores kind and list settings and no initial value', () => {
    @DefineComponent({ name: 'Holder' })
    class Holder extends Component {
      @DefineField({ type: 'script', kind: 'shader' })
      material?: { name: string; options: Record<string, unknown> };

      @DefineField({
        type: 'script',
        kind: 'behavior',
        multiple: true,
        unique: true,
        sortable: true,
      })
      list!: { id: string; name: string; options: Record<string, unknown> }[];
    }

    expect(getSchema(Holder)?.fields).toEqual([
      { name: 'material', type: 'script', kind: 'shader' },
      {
        name: 'list',
        type: 'script',
        kind: 'behavior',
        multiple: true,
        unique: true,
        sortable: true,
      },
    ]);
  });
});
