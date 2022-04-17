import { Entity, ComponentsEditionEvent } from '../entity';
import { createMockComponent } from '../../../__mocks__';

describe('Engine -> Entity', () => {
  it('Returns correct id and name', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });

    expect(entity1.getId()).toEqual('1');
    expect(entity2.getId()).toEqual('2');
    expect(entity1.name).toEqual('entity-1');
    expect(entity2.name).toEqual('entity-2');
  });

  it('Returns correct type', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    entity1.type = 'some-type-1';
    entity2.type = 'some-type-2';

    expect(entity1.type).toEqual('some-type-1');
    expect(entity2.type).toEqual('some-type-2');
  });

  it('Returns correct list of component names', () => {
    const entity = new Entity({
      id: '0',
      name: 'entity',
    });
    const component1 = createMockComponent('component-1');
    const component2 = createMockComponent('component-2');

    entity.setComponent('component-1', component1);
    entity.setComponent('component-2', component2);

    expect(entity.getComponentNamesList()).toStrictEqual([
      'component-1',
      'component-2',
    ]);
    expect(entity.getComponent('component-1')).toEqual(component1);
    expect(entity.getComponent('component-2')).toEqual(component2);
  });

  it('Returns correct list of component names after deletion one', () => {
    const entity = new Entity({
      id: '0',
      name: 'entity',
    });
    const component1 = createMockComponent('component-1');
    const component2 = createMockComponent('component-2');

    entity.setComponent('component-1', component1);
    entity.setComponent('component-2', component2);

    entity.removeComponent('component-2');

    expect(entity.getComponentNamesList()).toStrictEqual([
      'component-1',
    ]);
    expect(entity.getComponent('component-2')).toBeUndefined();
  });

  it('Returns correct ancestor', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    const entity3 = new Entity({
      id: '3',
      name: 'entity-3',
    });

    entity3.appendChild(entity2);
    entity2.appendChild(entity1);

    expect(entity1.getAncestor()).toEqual(entity3);
    expect(entity2.getAncestor()).toEqual(entity3);
    expect(entity3.getAncestor()).toEqual(entity3);
  });

  it('Returns correct ancestor after deletion relations', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    const entity3 = new Entity({
      id: '3',
      name: 'entity-3',
    });

    entity3.appendChild(entity2);
    entity2.appendChild(entity1);

    entity3.removeChild(entity2);

    expect(entity1.getAncestor()).toEqual(entity2);
    expect(entity2.getAncestor()).toEqual(entity2);
    expect(entity3.getAncestor()).toEqual(entity3);
  });

  it('Calls all subscription callbacks on component add/remove', () => {
    const entity = new Entity({
      id: '0',
      name: 'entity',
    });
    const subscription1 = jest.fn() as jest.Mock<void, [ComponentsEditionEvent]>;
    const wrappedSubscription1 = (event: ComponentsEditionEvent) => { subscription1(event); };
    const subscription2 = jest.fn() as jest.Mock<void, [ComponentsEditionEvent]>;
    const wrappedSubscription2 = (event: ComponentsEditionEvent) => { subscription2(event); };

    entity.subscribe(wrappedSubscription1);
    entity.setComponent('component-1', createMockComponent('component-1'));

    entity.subscribe(wrappedSubscription2);
    entity.setComponent('component-2', createMockComponent('component-2'));

    entity.removeComponent('component-1');

    expect(subscription1.mock.calls.length).toEqual(3);
    expect(subscription2.mock.calls.length).toEqual(2);

    expect(subscription1.mock.calls[0][0]).toStrictEqual({
      type: 'COMPONENT_ADDED',
      componentName: 'component-1',
      entity,
    });
    expect(subscription1.mock.calls[1][0]).toStrictEqual({
      type: 'COMPONENT_ADDED',
      componentName: 'component-2',
      entity,
    });
    expect(subscription1.mock.calls[2][0]).toStrictEqual({
      type: 'COMPONENT_REMOVED',
      componentName: 'component-1',
      entity,
    });

    expect(subscription2.mock.calls[0][0]).toStrictEqual({
      type: 'COMPONENT_ADDED',
      componentName: 'component-2',
      entity,
    });
    expect(subscription2.mock.calls[1][0]).toStrictEqual({
      type: 'COMPONENT_REMOVED',
      componentName: 'component-1',
      entity,
    });
  });

  it('Correct cleans subscriptions', () => {
    const entity = new Entity({
      id: '0',
      name: 'entity',
    });
    const subscription1 = jest.fn() as jest.Mock<void, [ComponentsEditionEvent]>;
    const wrappedSubscription1 = (event: ComponentsEditionEvent) => { subscription1(event); };

    entity.subscribe(wrappedSubscription1);

    entity.setComponent('component-1', createMockComponent('component-1'));

    entity.clearSubscriptions();

    entity.setComponent('component-2', createMockComponent('component-2'));
    entity.removeComponent('component-1');

    expect(subscription1.mock.calls.length).toEqual(1);
  });

  it('Returns added game object as child by id', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    const entity3 = new Entity({
      id: '3',
      name: 'entity-3',
    });

    entity3.appendChild(entity2);
    entity2.appendChild(entity1);

    expect(entity3.getChildById('2')).toEqual(entity2);
    expect(entity3.getChildById('1')).toBeUndefined();
    expect(entity2.getChildById('1')).toEqual(entity1);

    entity3.removeChild(entity2);

    expect(entity3.getChildById('2')).toBeUndefined();
  });

  it('Returns added game object as child by name', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    const entity3 = new Entity({
      id: '3',
      name: 'entity-3',
    });

    entity3.appendChild(entity2);
    entity2.appendChild(entity1);

    expect(entity3.getChildByName('entity-2')).toEqual(entity2);
    expect(entity3.getChildByName('entity-1')).toBeUndefined();
    expect(entity2.getChildByName('entity-1')).toEqual(entity1);

    entity3.removeChild(entity2);

    expect(entity3.getChildByName('entity-2')).toBeUndefined();
  });

  it('Throws error if child with same id already exists', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    const entity3 = new Entity({
      id: '2',
      name: 'entity-3',
    });

    entity1.appendChild(entity2);

    expect(() => {
      entity1.appendChild(entity3);
    }).toThrowError('Can\'t add child with id: 2. Child with same name already exists');
  });

  it('Throws error if child with same name already exists', () => {
    const entity1 = new Entity({
      id: '1',
      name: 'entity-1',
    });
    const entity2 = new Entity({
      id: '2',
      name: 'entity-2',
    });
    const entity3 = new Entity({
      id: '3',
      name: 'entity-2',
    });

    entity1.appendChild(entity2);

    expect(() => {
      entity1.appendChild(entity3);
    }).toThrowError('Can\'t add child with name: entity-2. Child with same name already exists');
  });
});
