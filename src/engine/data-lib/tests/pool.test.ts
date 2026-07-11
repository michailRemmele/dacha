import { Pool } from '../pool';

describe('Engine -> DataLib -> Pool', () => {
  it('Creates a new item via factory when the pool is empty', () => {
    let factoryCalls = 0;
    const pool = new Pool<{ value: number }>(() => {
      factoryCalls += 1;
      return { value: 0 };
    });

    const item = pool.acquire();

    expect(item).toEqual({ value: 0 });
    expect(factoryCalls).toBe(1);
  });

  it('Hands back a released item on the next acquire (identity)', () => {
    const pool = new Pool<{ value: number }>(() => ({ value: 0 }));

    const item = pool.acquire();
    item.value = 42;

    pool.release(item);

    const reacquired = pool.acquire();

    expect(reacquired).toBe(item);
  });

  it('Runs the reset callback on release', () => {
    const resetSpy = jest.fn((item: { value: number }) => {
      item.value = 0;
    });
    const pool = new Pool<{ value: number }>(() => ({ value: 0 }), resetSpy);

    const item = pool.acquire();
    item.value = 99;

    pool.release(item);

    expect(resetSpy).toHaveBeenCalledWith(item);
    expect(item.value).toBe(0);
  });

  it('Empties the pool on clear, so the next acquire calls the factory again', () => {
    let factoryCalls = 0;
    const pool = new Pool<{ value: number }>(() => {
      factoryCalls += 1;
      return { value: 0 };
    });

    const item = pool.acquire();
    pool.release(item);

    expect(factoryCalls).toBe(1);

    pool.clear();

    const reacquired = pool.acquire();

    expect(factoryCalls).toBe(2);
    expect(reacquired).not.toBe(item);
  });
});
