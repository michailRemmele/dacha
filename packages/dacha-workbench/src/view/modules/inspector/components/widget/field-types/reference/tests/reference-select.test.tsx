jest.mock('antd', () => ({
  Select: (props: {
    options: { value: string; label: string; disabled?: boolean }[];
    value?: string;
    disabled?: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
    labelRender?: () => React.ReactNode;
  }): React.ReactElement => (
    <div>
      <span data-testid="label">
        {props.labelRender
          ? props.labelRender()
          : (props.options.find((option) => option.value === props.value)
              ?.label ?? props.placeholder)}
      </span>
      <select
        aria-label="reference"
        disabled={props.disabled}
        value={props.value ?? ''}
        onChange={(event): void => props.onChange(event.target.value)}
      >
        {props.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ReferenceSelect } from '../reference-select';

const options = [
  { title: 'Door', value: 'door' },
  { title: 'Lever', value: 'lever' },
];

describe('ReferenceSelect', () => {
  it('shows Missing for an id it cannot find and keeps the value', () => {
    const onChange = jest.fn();
    render(
      <ReferenceSelect value="gone" options={options} onChange={onChange} />,
    );

    expect(screen.getByTestId('reference-missing')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent(
      'inspector.reference.missing',
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('still shows Missing for a stored value where nothing is available', () => {
    render(
      <ReferenceSelect
        value="gone"
        options={[]}
        available={false}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByTestId('reference-missing')).toBeInTheDocument();
  });
});
