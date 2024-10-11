export const insertionSort = <T>(array: T[], compareFn: (arg1: T, arg2: T) => number): T[] => {
  let i = 1;
  while (i < array.length) {
    let j = i;
    const x = array[j];
    while (j > 0 && compareFn(x, array[j - 1]) < 0) {
      array[j] = array[j - 1];
      j -= 1;
    }
    array[j] = x;
    i += 1;
  }
  return array;
};
