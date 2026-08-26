import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { VectorInput } from '..';

describe('VectorInput', () => {
  it('renders both axes with their current values', () => {
    render(<VectorInput value={{ x: 1, y: 2 }} />);

    const spinbuttons = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(spinbuttons).toHaveLength(2);
    expect(spinbuttons[0].value).toBe('1');
    expect(spinbuttons[1].value).toBe('2');
  });

  it('changing X calls onChange with the merged value, leaving Y untouched', () => {
    const onChange = jest.fn();
    render(<VectorInput value={{ x: 1, y: 2 }} onChange={onChange} />);

    const [xInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(xInput, { target: { value: '5' } });

    expect(onChange).toHaveBeenCalledWith({ x: 5, y: 2 });
  });

  it('changing Y calls onChange with the merged value, leaving X untouched', () => {
    const onChange = jest.fn();
    render(<VectorInput value={{ x: 1, y: 2 }} onChange={onChange} />);

    const [, yInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(yInput, { target: { value: '7' } });

    expect(onChange).toHaveBeenCalledWith({ x: 1, y: 7 });
  });

  it('blurring either axis calls onAccept once', () => {
    const onAccept = jest.fn();
    render(<VectorInput value={{ x: 1, y: 2 }} onAccept={onAccept} />);

    const [xInput, yInput] = screen.getAllByRole('spinbutton');
    fireEvent.blur(xInput);
    fireEvent.blur(yInput);

    expect(onAccept).toHaveBeenCalledTimes(2);
  });
});
