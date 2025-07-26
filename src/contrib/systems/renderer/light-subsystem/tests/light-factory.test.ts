import { AmbientLight, PointLight } from 'three/src/Three';

import { createLight, updateLight } from '../light-factory';

describe('Contrib -> RenderSystem -> LightSubsystem -> light factory', () => {
  describe('createLight()', () => {
    it('Returns correct light by type', () => {
      expect(createLight('ambient') instanceof AmbientLight).toBeTruthy();
      expect(createLight('point') instanceof PointLight).toBeTruthy();
    });

    it('Throws error if type not found', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createLight('notExistLightType');
      }).toThrow(TypeError);
    });
  });

  describe('updateLight()', () => {
    it('Updates ambient light correctly', () => {
      const light = new AmbientLight();
      const options = {
        color: '#112233',
        intensity: 2,
      };

      updateLight('ambient', light, options);

      expect(light.color.getHexString()).toBe('112233');
      expect(light.intensity).toBe(2);
      expect(light.position.z).toBe(1);
    });

    it('Updates point light correctly', () => {
      const light = new PointLight();
      const options = {
        color: '#aabbcc',
        intensity: 5,
        distance: 28,
      };

      updateLight('point', light, options);

      expect(light.color.getHexString()).toBe('aabbcc');
      expect(light.intensity).toBe(5);
      expect(light.distance).toBe(32);
      expect(light.position.z).toBe(14);
    });
  });
});
