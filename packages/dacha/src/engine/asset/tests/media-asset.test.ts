import { MediaAsset } from '../media-asset';

const deferred = <T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
} => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

class Picture extends MediaAsset<string> {
  load_: () => Promise<string> = () => Promise.resolve(`res-${this.id}`);
  loadCalls = 0;
  unloaded: string[] = [];

  protected fetchResource(): Promise<string> {
    this.loadCalls += 1;
    return this.load_();
  }

  protected disposeResource(resource: string): void {
    this.unloaded.push(resource);
  }
}

const settled = async <T>(loading: Promise<T>): Promise<T> => {
  await jest.advanceTimersByTimeAsync(500);
  return loading;
};

const picture = (): Picture => new Picture({ id: 'p1', name: 'P', data: {} });

describe('MediaAsset', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => void 0);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('loads once for concurrent calls and exposes the resource', async () => {
    const asset = picture();

    const [first, second] = await Promise.all([asset.load(), asset.load()]);
    await asset.load();

    expect(first).toBe('res-p1');
    expect(second).toBe('res-p1');
    expect(asset.resource).toBe('res-p1');
    expect(asset.loadCalls).toBe(1);
  });

  it('tries a failed load one more time', async () => {
    const asset = picture();
    asset.load_ = (): Promise<string> =>
      asset.loadCalls === 1
        ? Promise.reject(new Error('offline'))
        : Promise.resolve('second');

    const loading = asset.load();
    await jest.advanceTimersByTimeAsync(500);

    await expect(loading).resolves.toBe('second');
    expect(asset.resource).toBe('second');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('gives undefined and logs once after the second failure, then stops', async () => {
    const asset = picture();
    asset.load_ = (): Promise<string> => Promise.reject(new Error('404'));

    await expect(settled(asset.load())).resolves.toBeUndefined();
    await expect(asset.load()).resolves.toBeUndefined();

    expect(asset.loadCalls).toBe(2);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('turns a synchronous throw of fetchResource into a failed load', async () => {
    const asset = picture();
    asset.load_ = (): Promise<string> => {
      throw new Error('bad url');
    };

    await expect(settled(asset.load())).resolves.toBeUndefined();
  });

  it('unloads its resource through disposeResource', async () => {
    const asset = picture();
    await asset.load();

    asset.unload();

    expect(asset.unloaded).toEqual(['res-p1']);
    expect(asset.resource).toBeUndefined();
  });

  it('loads again after unload, also after a failed load', async () => {
    const asset = picture();
    asset.load_ = (): Promise<string> => Promise.reject(new Error('404'));
    await settled(asset.load());

    asset.unload();
    asset.load_ = (): Promise<string> => Promise.resolve('fixed');

    await expect(asset.load()).resolves.toBe('fixed');
  });

  it('drops and unloads a result that arrives after unload', async () => {
    const asset = picture();
    const pending = deferred<string>();
    asset.load_ = (): Promise<string> => pending.promise;
    const stale = asset.load();

    asset.unload();
    pending.resolve('old');

    await expect(stale).resolves.toBeUndefined();
    expect(asset.resource).toBeUndefined();
    expect(asset.unloaded).toEqual(['old']);
  });
});
