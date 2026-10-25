import React from 'react';

export const Select = (props: {
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string | null;
  placeholder?: string;
  onChange: (value: string) => void;
  labelRender?: () => React.ReactNode;
}): React.ReactElement => (
  <div>
    {props.labelRender ? props.labelRender() : null}
    <select
      aria-label={props.value === null ? 'add' : 'entry'}
      value={props.value ?? ''}
      onChange={(event): void => props.onChange(event.target.value)}
    >
      {props.value === null ? <option value="">-</option> : null}
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const Button = (props: {
  onClick: () => void;
  'data-testid'?: string;
  children?: React.ReactNode;
}): React.ReactElement => (
  <button data-testid={props['data-testid']} onClick={props.onClick}>
    {props.children}
  </button>
);
