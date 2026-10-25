jest.mock('antd', () => jest.requireActual('./antd-mock'));
const mockMove: { current?: (from: number, to: number) => void } = {};
jest.mock('../../../../sortable-list', () => ({
  SortableList: (props: {
    items: string[];
    sortable?: boolean;
    renderItem: (item: string, index: number, handle: unknown) => unknown;
    onMove: (from: number, to: number) => void;
  }): unknown => {
    mockMove.current = props.onMove;
    return props.items.map((item, index) => (
      <div key={index}>
        {props.renderItem(item, index, null) as React.ReactNode}
      </div>
    ));
  },
}));

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ReferenceListField } from '../reference-list-field';

const OPTIONS = [
  { title: 'A', value: 'a' },
  { title: 'B', value: 'b' },
  { title: 'C', value: 'c' },
];

const setup = (
  value: string[],
  props: { unique?: boolean } = {},
): { onChange: jest.Mock; onAccept: jest.Mock } => {
  const onChange = jest.fn();
  const onAccept = jest.fn();
  render(
    <ReferenceListField
      type="template"
      options={OPTIONS}
      available
      value={value}
      label="Prefabs"
      onChange={onChange}
      onAccept={onAccept}
      sortable
      {...props}
    />,
  );
  return { onChange, onAccept };
};

const addOptions = (): string[] =>
  Array.from((screen.getByLabelText('add') as HTMLSelectElement).options).map(
    (option) => option.value,
  );

describe('ReferenceListField', () => {
  it('leaves out ids already in a unique list', () => {
    setup(['a'], { unique: true });
    expect(addOptions()).toEqual(['', 'b', 'c']);
  });

  it('does not let a row of a unique list take an id another row holds', () => {
    setup(['a', 'b'], { unique: true });

    const second = screen.getAllByLabelText('entry')[1] as HTMLSelectElement;
    expect(Array.from(second.options).map((option) => option.value)).toEqual([
      '',
      'b',
      'c',
    ]);
  });

  it('offers ids again in a list that is not unique', () => {
    setup(['a']);
    expect(addOptions()).toEqual(['', 'a', 'b', 'c']);
  });

  it('removes exactly the row whose delete is clicked, with repeats', () => {
    const { onChange } = setup(['a', 'a', 'b']);

    fireEvent.click(screen.getAllByTestId('reference-entry-delete')[1]);

    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('replaces one row in place', () => {
    const { onChange } = setup(['a', 'b']);

    fireEvent.change(screen.getAllByLabelText('entry')[1], {
      target: { value: 'c' },
    });

    expect(onChange).toHaveBeenCalledWith(['a', 'c']);
  });

  it('reorders as one undo step', () => {
    const { onChange, onAccept } = setup(['a', 'b', 'c']);

    act(() => mockMove.current?.(0, 2));

    expect(onChange).toHaveBeenCalledWith(['b', 'c', 'a']);
    expect(onAccept).toHaveBeenCalledTimes(1);
  });
});
