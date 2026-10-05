import React, { useContext, type FC } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { NewItemTracker, NewItemContext } from '..';

const Item: FC<{ id: string }> = ({ id }) => {
  const isNew = useContext(NewItemContext);
  return <div data-testid={id} data-new={String(isNew)} />;
};

const List: FC<{ ids: string[]; resetKey?: string }> = ({ ids, resetKey }) => (
  <NewItemTracker resetKey={resetKey}>
    {ids.map((id) => (
      <Item key={id} id={id} />
    ))}
  </NewItemTracker>
);

const isNew = (id: string): string | null =>
  screen.getByTestId(id).getAttribute('data-new');

describe('NewItemTracker', () => {
  it('treats the items of the first render as existing', () => {
    render(<List ids={['a', 'b']} />);

    expect(isNew('a')).toBe('false');
    expect(isNew('b')).toBe('false');
  });

  it('marks an item that appears later as new', () => {
    const { rerender } = render(<List ids={['a']} />);

    rerender(<List ids={['a', 'b']} />);

    expect(isNew('a')).toBe('false');
    expect(isNew('b')).toBe('true');
  });

  it('marks the first item of a list that started empty as new', () => {
    const { rerender } = render(<List ids={[]} />);

    rerender(<List ids={['a']} />);

    expect(isNew('a')).toBe('true');
  });

  it('marks an item as new again when it comes back after removal', () => {
    const { rerender } = render(<List ids={['a', 'b']} />);

    rerender(<List ids={['a']} />);
    rerender(<List ids={['a', 'b']} />);

    expect(isNew('b')).toBe('true');
  });

  it('treats the items as existing when the reset key changes', () => {
    const { rerender } = render(<List ids={['a']} resetKey="actor-1" />);

    rerender(<List ids={['b', 'c']} resetKey="actor-2" />);

    expect(isNew('b')).toBe('false');
    expect(isNew('c')).toBe('false');
  });
});
