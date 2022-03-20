export const filterByKey = <T>(
  data: Record<string, T>,
  key: string,
): Record<string, T> => Object.keys(data)
    .reduce((acc: Record<string, T>, currentKey) => {
      if (currentKey !== key) {
        acc[currentKey] = data[currentKey];
      }

      return acc;
    }, {});
