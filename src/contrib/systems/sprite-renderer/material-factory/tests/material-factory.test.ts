import { MeshBasicMaterial, MeshStandardMaterial, Texture } from 'three/src/Three';

import { createMaterial, updateMaterial } from '../index';

describe('Contrib -> RenderSystem -> material factory', () => {
  describe('createMaterial()', () => {
    it('Returns correct material by type', () => {
      expect(createMaterial('basic') instanceof MeshBasicMaterial).toBeTruthy();
      expect(createMaterial('lightsensitive') instanceof MeshStandardMaterial).toBeTruthy();
    });

    it('Throws error if type not found', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createMaterial('notExistLightType');
      }).toThrow(TypeError);
    });
  });

  describe('updateMaterial()', () => {
    it('Updates basic material correctly', () => {
      const material = new MeshBasicMaterial();
      const texture = new Texture();
      const options = {
        color: '#112233',
      };

      updateMaterial('basic', material, options, texture);

      expect(material.color.getHexString()).toBe('112233');
      expect(material.map).not.toBeNull();
      expect(material.transparent).toBeTruthy();
    });

    it('Updates lightsensitive material correctly', () => {
      const material = new MeshStandardMaterial();
      const texture = new Texture();
      const options = {
        color: '#aabbcc',
      };

      updateMaterial('lightsensitive', material, options, texture);

      expect(material.color.getHexString()).toBe('aabbcc');
      expect(material.map).not.toBeNull();
      expect(material.transparent).toBeTruthy();
    });
  });
});
