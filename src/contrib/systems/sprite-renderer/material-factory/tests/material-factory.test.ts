import { MeshBasicMaterial, Texture } from 'three/src/Three';

import { Sprite } from '../../../../components/sprite';
import { createMaterial, updateMaterial } from '../index';

describe('Contrib -> RenderSystem -> material factory', () => {
  describe('createMaterial()', () => {
    it('Returns correct material by type', () => {
      expect(createMaterial() instanceof MeshBasicMaterial).toBeTruthy();
    });
  });

  describe('updateMaterial()', () => {
    it('Updates basic material correctly', () => {
      const material = new MeshBasicMaterial();
      const texture = new Texture();
      const sprite = new Sprite({
        src: 'some-path',
        width: 0,
        height: 0,
        sortCenter: [0, 0],
        slice: 1,
        rotation: 0,
        flipX: false,
        flipY: false,
        disabled: false,
        sortingLayer: 'some-layer',
        fit: 'stretch',
        color: '#112233',
        blending: 'normal',
        opacity: 1,
      });

      updateMaterial(sprite, material, texture);

      expect(material.color.getHexString()).toBe('112233');
      expect(material.map).not.toBeNull();
      expect(material.transparent).toBeTruthy();
    });
  });
});
