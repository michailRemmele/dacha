jest.mock('antd', () => jest.requireActual('./antd-mock'));
jest.mock('../use-reference-options', () => ({
  useTemplateOptions: (): unknown => ({
    available: true,
    options: [
      { title: 'A', value: 'a' },
      { title: 'B', value: 'b' },
      { title: 'C', value: 'c' },
    ],
  }),
}));
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
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TemplateField } from '..';

describe('reference fields after a schema change', () => {
  it('keeps a single id as the first entry when the field becomes a list', () => {
    const onChange = jest.fn();
    render(
      <TemplateField
        value="a"
        multiple
        label="Prefabs"
        onChange={onChange}
        onAccept={jest.fn()}
      />,
    );

    expect(screen.getAllByLabelText('entry')).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('add'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('shows the first id of a stored list when the field becomes single', () => {
    render(
      <TemplateField
        value={['b', 'c']}
        label="Prefab"
        onChange={jest.fn()}
        onAccept={jest.fn()}
      />,
    );

    expect((screen.getByLabelText('entry') as HTMLSelectElement).value).toBe(
      'b',
    );
  });
});
