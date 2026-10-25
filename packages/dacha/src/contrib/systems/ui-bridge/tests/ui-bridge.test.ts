import { UIBridge } from '../index';
import { World } from '../../../../engine/world';
import { ActorCreator, ActorSpawner } from '../../../../engine/actor';
import { TemplateCollection } from '../../../../engine/template';
import { Assets } from '../../../../engine/asset';
import { ReferenceWalker } from '../../../../engine/reference';
import { Time } from '../../../../engine/time';

describe('UIBridge', () => {
  it('throws when created without dependencies', () => {
    const templateCollection = new TemplateCollection();

    expect(
      () =>
        new UIBridge({
          world: new World({ id: 'world', name: 'world' }),
          actorSpawner: new ActorSpawner(
            new ActorCreator([], templateCollection),
          ),
          templateCollection,
          assets: new Assets({ walker: new ReferenceWalker([]) }),
          globalOptions: {},
          time: new Time(),
        }),
    ).toThrow('UIBridge.with({ loadUI })');
  });
});
