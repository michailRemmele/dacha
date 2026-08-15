export const STATE_TYPE = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
}

export const PICK_MODE = {
  ONE_DIMENSIONAL: '1D',
  TWO_DIMENSIONAL: '2D',
}

export const COMPARATOR_VALUE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  COMPONENT_VALUE: 'componentValue',
}

export const CONDITION_TYPE = {
  EVENT: 'event',
  COMPARATOR: 'comparator',
}

export const CHILDREN_FIELD_MAP: Record<string, string | undefined> = {
  states: 'substates',
  substates: undefined,
  transitions: undefined,
  frames: undefined,
}
