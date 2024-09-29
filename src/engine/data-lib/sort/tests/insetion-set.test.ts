import { insertionSort } from '../insertion-sort';

describe('Engine -> DataLib -> insertionSort()', () => {
  it('Sort correctly', () => {
    const arr1 = [5, 4, 3, 2, 1];
    const arr2 = [100, -100];
    const arr3 = [10, 20, 30, 40, 50];
    const arr4 = [{ val: 1 }, { val: 3 }, { val: 5 }];
    const arr5: number[] = [];
    const arr6 = [1];

    expect(insertionSort(arr1, (a, b) => a - b)).toStrictEqual([1, 2, 3, 4, 5]);
    expect(insertionSort(arr2, (a, b) => a - b)).toStrictEqual([-100, 100]);
    expect(insertionSort(arr3, (a, b) => a - b)).toStrictEqual([10, 20, 30, 40, 50]);
    expect(insertionSort(arr4, (a, b) => b.val - a.val))
      .toStrictEqual([{ val: 5 }, { val: 3 }, { val: 1 }]);
    expect(insertionSort(arr5, (a, b) => a - b)).toStrictEqual([]);
    expect(insertionSort(arr6, (a, b) => a - b)).toStrictEqual([1]);
  });
});
