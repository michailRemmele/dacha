import { BaseObject } from '../base-object';

describe('Engine -> BaseObject', () => {
  it('Returns correct id and name', () => {
    const baseObject1 = new BaseObject({
      id: '1',
      name: 'base-object-1',
    });
    const baseObject2 = new BaseObject({
      id: '2',
      name: 'base-object-2',
    });

    expect(baseObject1.id).toEqual('1');
    expect(baseObject2.id).toEqual('2');
    expect(baseObject1.name).toEqual('base-object-1');
    expect(baseObject2.name).toEqual('base-object-2');
  });

  it('Adds children correctly', () => {
    const baseObject1 = new BaseObject({
      id: '1',
      name: 'base-object-1',
    });
    const baseObject2 = new BaseObject({
      id: '2',
      name: 'base-object-2',
    });
    const baseObject3 = new BaseObject({
      id: '3',
      name: 'base-object-3',
    });

    baseObject1.appendChild(baseObject2);
    baseObject2.appendChild(baseObject3);

    expect(baseObject1.children).toEqual([baseObject2]);
    expect(baseObject2.children).toEqual([baseObject3]);

    expect(baseObject2.parent).toEqual(baseObject1);
    expect(baseObject3.parent).toEqual(baseObject2);
  });

  it('Returns added base object as a child by id', () => {
    const baseObject1 = new BaseObject({
      id: '1',
      name: 'base-object-1',
    });
    const baseObject2 = new BaseObject({
      id: '2',
      name: 'base-object-2',
    });
    const baseObject3 = new BaseObject({
      id: '3',
      name: 'base-object-3',
    });

    baseObject1.appendChild(baseObject2);
    baseObject2.appendChild(baseObject3);

    expect(baseObject1.getObjectById('2')).toEqual(baseObject2);
    expect(baseObject1.getObjectById('3')).toEqual(baseObject3);

    expect(baseObject2.getObjectById('3')).toEqual(baseObject3);

    expect(baseObject3.getObjectById('1')).toBeUndefined();

    baseObject1.removeChild(baseObject2);

    expect(baseObject1.getObjectById('3')).toBeUndefined();
  });

  it('Returns added game object as child by name', () => {
    const baseObject1 = new BaseObject({
      id: '1',
      name: 'base-object-1',
    });
    const baseObject2 = new BaseObject({
      id: '2',
      name: 'base-object-2',
    });
    const baseObject3 = new BaseObject({
      id: '3',
      name: 'base-object-3',
    });

    baseObject1.appendChild(baseObject2);
    baseObject2.appendChild(baseObject3);

    expect(baseObject1.getObjectByName('base-object-2')).toEqual(baseObject2);
    expect(baseObject1.getObjectByName('base-object-3')).toEqual(baseObject3);

    expect(baseObject2.getObjectByName('base-object-3')).toEqual(baseObject3);

    expect(baseObject3.getObjectByName('base-object-1')).toBeUndefined();

    baseObject1.removeChild(baseObject2);

    expect(baseObject1.getObjectByName('base-object-3')).toBeUndefined();
  });

  it('Returns first added base object if there are few of them with same name', () => {
    const baseObject1 = new BaseObject({
      id: '1',
      name: 'base-object-1',
    });
    const baseObject2 = new BaseObject({
      id: '2',
      name: 'base-object-2',
    });
    const baseObject3 = new BaseObject({
      id: '3',
      name: 'base-object-2',
    });

    baseObject1.appendChild(baseObject2);
    baseObject1.appendChild(baseObject3);

    expect(baseObject1.getObjectByName('base-object-2')).toEqual(baseObject2);
  });
});
