import { Entity } from '../entity';

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

    expect(entity1.id).toEqual('1');
    expect(entity2.id).toEqual('2');
    expect(entity1.name).toEqual('entity-1');
    expect(entity2.name).toEqual('entity-2');
  });

  it('Adds children correctly', () => {
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

    entity1.appendChild(entity2);
    entity2.appendChild(entity3);

    expect(entity1.children).toEqual([entity2]);
    expect(entity2.children).toEqual([entity3]);

    expect(entity2.parent).toEqual(entity1);
    expect(entity3.parent).toEqual(entity2);
  });

  it('Returns added entity as a child by id', () => {
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

    entity1.appendChild(entity2);
    entity2.appendChild(entity3);

    expect(entity1.findChildById('2')).toEqual(entity2);
    expect(entity1.findChildById('3')).toEqual(entity3);

    expect(entity2.findChildById('3')).toEqual(entity3);

    expect(entity3.findChildById('1')).toBeUndefined();

    entity1.removeChild(entity2);

    expect(entity1.findChildById('3')).toBeUndefined();
  });

  it('Returns added entity as child by name', () => {
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

    entity1.appendChild(entity2);
    entity2.appendChild(entity3);

    expect(entity1.findChildByName('entity-2')).toEqual(entity2);
    expect(entity1.findChildByName('entity-3')).toEqual(entity3);

    expect(entity2.findChildByName('entity-3')).toEqual(entity3);

    expect(entity3.findChildByName('entity-1')).toBeUndefined();

    entity1.removeChild(entity2);

    expect(entity1.findChildByName('entity-3')).toBeUndefined();
  });

  it('Returns first added entity if there are few of them with same name', () => {
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
    entity1.appendChild(entity3);

    expect(entity1.findChildByName('entity-2')).toEqual(entity2);
  });
});
