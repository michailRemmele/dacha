/**
 * Checks if two arrays are equal
 */
export const arraysEqual = (array1: unknown[], array2: unknown[]): boolean => {
  if (array1 === array2) {
    return true
  }
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false
  }
  if (array1.length !== array2.length) {
    return false
  }

  return array1.every((item, index) => array2[index] === item)
}
