import { SystemAPIRegistry } from '../system-api-registry';

class PhysicsAPI {
  raycast(): string {
    return 'hit';
  }
}

class CameraAPI {
  getCurrentCamera(): string {
    return 'camera';
  }
}

describe('Engine -> World -> SystemAPIRegistry', () => {
  let systemApi: SystemAPIRegistry;

  beforeEach(() => {
    systemApi = new SystemAPIRegistry();
  });

  it('Registers and returns APIs by class', () => {
    const physicsApi = new PhysicsAPI();

    systemApi.register(physicsApi);

    const resolvedApi = systemApi.get(PhysicsAPI);

    expect(resolvedApi).toBe(physicsApi);
    expect(resolvedApi.raycast()).toBe('hit');
  });

  it('Throws when API is missing', () => {
    expect(() => {
      systemApi.get(CameraAPI);
    }).toThrow("Can't find API with the following name: CameraAPI");
  });

  it('Prevents duplicate registrations for the same API class', () => {
    systemApi.register(new PhysicsAPI());

    expect(() => {
      systemApi.register(new PhysicsAPI());
    }).toThrow('API already registered: PhysicsAPI');
  });

  it('Can check and unregister APIs', () => {
    systemApi.register(new PhysicsAPI());

    expect(systemApi.has(PhysicsAPI)).toBe(true);

    systemApi.unregister(PhysicsAPI);

    expect(systemApi.has(PhysicsAPI)).toBe(false);
  });
});
