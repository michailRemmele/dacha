import { Light, PointLightOptions } from '../index';

describe('Contrib -> components -> Light', () => {
  it('Returns correct values ', () => {
    const ambientLight = new Light({
      type: 'ambient',
      options: {
        color: '#fff',
        intensity: 0.5,
      },
    }).clone();

    const pointLight = new Light({
      type: 'point',
      options: {
        color: '#000',
        intensity: 1,
        distance: 32,
      },
    }).clone();

    expect(ambientLight.type).toEqual('ambient');
    expect(ambientLight.options.color).toEqual('#fff');
    expect(ambientLight.options.intensity).toEqual(0.5);

    expect(pointLight.type).toEqual('point');
    expect(pointLight.options.color).toEqual('#000');
    expect(pointLight.options.intensity).toEqual(1);
    expect((pointLight.options as PointLightOptions).distance).toEqual(32);
  });

  it('Correct updates values ', () => {
    const ambientLight = new Light({
      type: 'ambient',
      options: {
        color: '#fff',
        intensity: 0.5,
      },
    }).clone();

    const pointLight = new Light({
      type: 'point',
      options: {
        color: '#000',
        intensity: 1,
        distance: 32,
      },
    }).clone();

    ambientLight.options.color = '#001122';
    ambientLight.options.intensity = 1;

    expect(ambientLight.options.color).toEqual('#001122');
    expect(ambientLight.options.intensity).toEqual(1);

    pointLight.options.color = '#123';
    pointLight.options.intensity = 0.25;
    (pointLight.options as PointLightOptions).distance = 24;

    expect(pointLight.options.color).toEqual('#123');
    expect(pointLight.options.intensity).toEqual(0.25);
    expect((pointLight.options as PointLightOptions).distance).toEqual(24);
  });

  it('Clones return deep copy of original component', () => {
    const ambientLight = new Light({
      type: 'ambient',
      options: {
        color: '#fff',
        intensity: 0.5,
      },
    }).clone();
    const cloneAmbientLight = ambientLight.clone();

    const pointLight = new Light({
      type: 'point',
      options: {
        color: '#000',
        intensity: 1,
        distance: 32,
      },
    }).clone();
    const clonePointLight = pointLight.clone();

    expect(ambientLight).not.toBe(cloneAmbientLight);
    expect(ambientLight.options).not.toBe(cloneAmbientLight.options);

    expect(pointLight).not.toBe(clonePointLight);
    expect(pointLight.options).not.toBe(clonePointLight.options);
  });
});
