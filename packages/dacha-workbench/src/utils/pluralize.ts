  const IRREGULARS: Record<string, string> = {
    person: 'people',
    child: 'children',
    mouse: 'mice',
    man: 'men',
    woman: 'women',
    foot: 'feet',
    tooth: 'teeth',
    goose: 'geese',
  };

export const pluralize = (word: string): string => {
  if (IRREGULARS[word.toLowerCase()]) {
    return IRREGULARS[word.toLowerCase()];
  }

  if (word.match(/[^aeiou]y$/i)) {
    return word.replace(/y$/, 'ies');
  }

  if (word.match(/(s|x|z|ch|sh)$/i)) {
    return word + 'es';
  }

  return word + 's';
};
