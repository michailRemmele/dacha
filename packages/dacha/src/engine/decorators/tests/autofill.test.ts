import { Component } from '../../component';
import { SceneSystem } from '../../system';
import { Asset } from '../../asset';
import { Behavior } from '../../../contrib/systems/behavior-system';
import { DefineComponent, DefineField } from '..';

describe('DefineField autofill on a component', () => {
  class Creature extends Component {
    @DefineField({ initialValue: 0.5 }) mass!: number;
  }

  it('reads the value from the configuration', () => {
    expect(new Creature({ mass: 2 }).mass).toBe(2);
  });

  it('falls back to initialValue when the key is missing', () => {
    expect(new Creature({}).mass).toBe(0.5);
    expect(new Creature().mass).toBe(0.5);
  });

  it('treats an explicit undefined or null as missing', () => {
    expect(new Creature({ mass: undefined }).mass).toBe(0.5);
    expect(new Creature({ mass: null }).mass).toBe(0.5);
  });

  it('leaves a field without initialValue undefined', () => {
    class Team extends Component {
      @DefineField({ type: 'number' }) index?: number;
    }

    expect(new Team({}).index).toBeUndefined();
    expect(new Team({ index: 2 }).index).toBe(2);
  });

  it('reads the configuration key from the name option', () => {
    class Health extends Component {
      @DefineField({ name: 'hp', initialValue: 1 }) points!: number;
    }

    expect(new Health({ hp: 5 }).points).toBe(5);
    expect(new Health({ points: 5 }).points).toBe(1);
  });

  it('prefers the configuration, then the initializer, then initialValue', () => {
    class Speed extends Component {
      @DefineField({ initialValue: 1 }) value = 2;
    }

    expect(new Speed({ value: 3 }).value).toBe(3);
    expect(new Speed({}).value).toBe(2);
  });

  it('gives each instance its own copy of an object initialValue', () => {
    class Offset extends Component {
      @DefineField({ initialValue: { x: 1, y: 2 } }) offset!: {
        x: number;
        y: number;
      };
    }

    const a = new Offset({});
    const b = new Offset({});

    expect(a.offset).toEqual({ x: 1, y: 2 });
    expect(a.offset).not.toBe(b.offset);
  });

  it('copies an object from the configuration', () => {
    class List extends Component {
      @DefineField({ type: 'data', initialValue: [] }) items!: number[];
    }
    const config = { items: [1] };

    new List(config).items.push(2);

    expect(config.items).toEqual([1]);
  });

  it('fills a parent field in a subclass without a constructor', () => {
    class Base extends Component {
      @DefineField({ initialValue: 1 }) a!: number;
    }
    class Child extends Base {
      @DefineField({ initialValue: 2 }) b!: number;
    }

    const child = new Child({ a: 10, b: 20 });

    expect(child.a).toBe(10);
    expect(child.b).toBe(20);
  });

  it('lets a constructor override the filled value', () => {
    class Doubled extends Component {
      @DefineField({ initialValue: 1 }) value!: number;

      constructor(config: { value: number }) {
        super(config);
        this.value *= 2;
      }
    }

    expect(new Doubled({ value: 3 }).value).toBe(6);
  });

  it('gives initialValue to a constructor that calls super() without the configuration', () => {
    class Legacy extends Component {
      @DefineField({ initialValue: 1 }) value!: number;
      seen: number;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(_config: { value: number }) {
        super();
        this.seen = this.value;
      }
    }

    const legacy = new Legacy({ value: 3 });

    expect(legacy.seen).toBe(1);
    expect(legacy.value).toBe(1);
  });

  it('lets a later field read a filled field', () => {
    class Health extends Component {
      @DefineField({ initialValue: 100 }) points!: number;
      maxPoints = this.points;
    }

    expect(new Health({ points: 40 }).maxPoints).toBe(40);
  });

  it('does not assign getters or class-level fields', () => {
    @DefineComponent({
      name: 'AutofillAccessors',
      fields: [{ name: 'radius', type: 'number', initialValue: 3 }],
    })
    class Accessors extends Component {
      private stored = 0;

      @DefineField({ initialValue: 1 })
      get speed(): number {
        return this.stored;
      }
      set speed(value: number) {
        this.stored = value;
      }
    }

    const instance = new Accessors({ speed: 5, radius: 7 });

    expect(instance.speed).toBe(0);
    expect('radius' in instance).toBe(false);
  });
});

describe('DefineField autofill on other kinds', () => {
  it('reads behavior fields from the options and ignores engine services', () => {
    class GrowPlant extends Behavior {
      @DefineField({ initialValue: 4 }) secondsPerStage!: number;
    }
    const service = jest.fn();

    expect(
      new GrowPlant({ secondsPerStage: 2, world: service }).secondsPerStage,
    ).toBe(2);
    expect(new GrowPlant({ world: service }).secondsPerStage).toBe(4);
  });

  it('fills a behavior with its own constructor that passes the options on', () => {
    class Patrol extends Behavior {
      @DefineField({ initialValue: 1 }) speed!: number;
      ready: boolean;

      constructor(options: { speed?: number }) {
        super(options);
        this.ready = true;
      }
    }

    expect(new Patrol({ speed: 3 }).speed).toBe(3);
  });

  it('reads system settings from the options', () => {
    class Spawner extends SceneSystem {
      @DefineField({ initialValue: 2 }) spawnInterval!: number;
    }

    expect(new Spawner({ spawnInterval: 5 }).spawnInterval).toBe(5);
    expect(new Spawner({}).spawnInterval).toBe(2);
  });

  it('reads asset fields from data', () => {
    class Level extends Asset {
      @DefineField({ initialValue: 1 }) difficulty!: number;
    }

    expect(
      new Level({ id: '1', name: 'level', data: { difficulty: 3 } }).difficulty,
    ).toBe(3);
    expect(new Level({ id: '2', name: 'level', data: {} }).difficulty).toBe(1);
  });
});
