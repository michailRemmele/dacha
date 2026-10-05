const mockSchemas: Record<string, unknown> = {};

jest.mock('../../../../../../../hooks', () => ({
  useSchemas: (): unknown => mockSchemas,
}));
jest.mock('../../..', () => ({
  Widget: ({
    path,
    context,
  }: {
    path: string[];
    context?: Record<string, unknown>;
  }): React.ReactElement => (
    <div data-testid="options" data-path={path.join('/')}>
      {JSON.stringify(context)}
    </div>
  ),
}));
jest.mock('../../../../custom-widget', () => ({
  CustomWidget: (): null => null,
}));
jest.mock('../../../../section', () => ({
  Section: (props: {
    title: string;
    onDelete: () => void;
    extra?: React.ReactNode;
    children: React.ReactNode;
  }): React.ReactElement => (
    <div data-testid={`panel-${props.title}`}>
      {props.extra}
      <button onClick={props.onDelete}>delete {props.title}</button>
      {props.children}
    </div>
  ),
}));
jest.mock('../../../../entity-picker', () => ({
  EntitySelect: (props: {
    options: { value: string }[];
    onAdd: (value: string | null) => void;
  }): React.ReactElement => (
    <div data-testid="select">
      {props.options.map((option) => (
        <button
          key={option.value}
          onClick={(): void => props.onAdd(option.value)}
        >
          pick {option.value}
        </button>
      ))}
      <button onClick={(): void => props.onAdd(null)}>pick none</button>
    </div>
  ),
  EntityMultiselect: (props: {
    options: { value: string }[];
    onAdd: (value: string) => void;
  }): React.ReactElement => (
    <div data-testid="multiselect">
      {props.options.map((option) => (
        <button
          key={option.value}
          onClick={(): void => props.onAdd(option.value)}
        >
          add {option.value}
        </button>
      ))}
    </div>
  ),
}));
jest.mock('react-i18next', () => {
  const mockT = jest.fn((key: string) => key);
  return {
    mockT,
    useTranslation: (): unknown => ({ t: mockT, i18n: {} }),
    I18nextProvider: ({ children }: { children: React.ReactNode }): unknown =>
      children,
  };
});
jest.mock('../../../../../../../../utils/uuid', () => ({
  uuid: (): string => 'new-id',
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ScriptField, type ScriptFieldProps } from '..';
import { WidgetFieldContext } from '../../../widget-field-context';

interface Rendered {
  onChange: jest.Mock;
  onAccept: jest.Mock;
  rerender: (next: Partial<ScriptFieldProps>) => void;
}

const setSchemas = (value: Record<string, unknown>): void => {
  Object.keys(mockSchemas).forEach((key) => delete mockSchemas[key]);
  Object.assign(mockSchemas, value);
};

const renderField = (
  props: Partial<ScriptFieldProps>,
  fieldPath: string[],
  data: Record<string, unknown> = {},
): Rendered => {
  const onChange = jest.fn();
  const onAccept = jest.fn();
  const element = (next: Partial<ScriptFieldProps>): React.ReactElement => (
    <WidgetFieldContext.Provider
      value={{ path: fieldPath.slice(0, -1), fieldPath, data }}
    >
      <ScriptField
        label="Label"
        kind="behavior"
        onChange={onChange}
        onAccept={onAccept}
        {...next}
      />
    </WidgetFieldContext.Provider>
  );
  const { rerender } = render(element(props));
  return {
    onChange,
    onAccept,
    rerender: (next): void => rerender(element(next)),
  };
};

beforeEach(() => {
  setSchemas({
    Patrol: { fields: [{ name: 'speed', type: 'number', initialValue: 1 }] },
    Wave: { fields: [] },
  });
  Object.defineProperty(window, 'electron', {
    writable: true,
    value: {
      getEditorConfig: () => ({ formatWidgetNames: true }),
      createBehavior: jest.fn(),
    },
  });
});

describe('ScriptField, single', () => {
  const fieldPath = ['mesh', 'material'];

  it('commits the chosen class with its initial options', () => {
    const { onChange, onAccept } = renderField({ kind: 'shader' }, fieldPath);
    fireEvent.click(screen.getByText('pick Patrol'));
    expect(onChange).toHaveBeenCalledWith({
      name: 'Patrol',
      options: { speed: 1 },
    });
    expect(onAccept).toHaveBeenCalled();
  });

  it('commits no value when "none" is chosen', () => {
    const { onChange, onAccept } = renderField(
      { kind: 'shader', value: { name: 'Patrol', options: {} } },
      fieldPath,
    );
    fireEvent.click(screen.getByText('pick none'));
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(onAccept).toHaveBeenCalled();
  });

  it('edits the options of the chosen class under the field path', () => {
    const { rerender } = renderField(
      { kind: 'shader', value: { name: 'Patrol', options: {} } },
      fieldPath,
      { a: 1 },
    );
    const options = screen.getByTestId('options');
    expect(options).toHaveAttribute('data-path', 'mesh/material/options');
    expect(options).toHaveTextContent('{"a":1}');

    rerender({ kind: 'shader', value: { name: 'Gone', options: {} } });
    expect(screen.getByText('scriptField.noSchema.title')).toBeInTheDocument();
  });
});

describe('ScriptField, list', () => {
  const fieldPath = ['actor', 'list'];
  const patrol = { id: 'b1', name: 'Patrol', options: {} };

  it('commits the list with a new entry', () => {
    const { onChange, onAccept } = renderField(
      { multiple: true, value: [patrol] },
      fieldPath,
    );
    fireEvent.click(screen.getByText('add Wave'));
    expect(onChange).toHaveBeenCalledWith([
      patrol,
      { id: 'new-id', name: 'Wave', options: {} },
    ]);
    expect(onAccept).toHaveBeenCalled();
  });

  it('starts from an empty list when there is no value', () => {
    const { onChange } = renderField({ multiple: true }, fieldPath);
    fireEvent.click(screen.getByText('add Patrol'));
    expect(onChange).toHaveBeenCalledWith([
      { id: 'new-id', name: 'Patrol', options: { speed: 1 } },
    ]);
  });

  it('offers a class already in the list again unless the list is unique', () => {
    const { rerender } = renderField(
      { multiple: true, value: [patrol] },
      fieldPath,
    );
    expect(screen.getByText('add Patrol')).toBeInTheDocument();

    rerender({ multiple: true, unique: true, value: [patrol] });
    expect(screen.queryByText('add Patrol')).not.toBeInTheDocument();
    expect(screen.getByText('add Wave')).toBeInTheDocument();
  });

  it('commits the list without a deleted entry, also one without a schema', () => {
    const gone = { id: 'b2', name: 'Gone', options: {} };
    const { onChange } = renderField(
      { multiple: true, value: [patrol, gone] },
      fieldPath,
    );
    expect(screen.getByText('scriptField.noSchema.title')).toBeInTheDocument();
    fireEvent.click(screen.getByText('delete Gone'));
    expect(onChange).toHaveBeenCalledWith([patrol]);
  });

  it('edits the options of each entry under its own path', () => {
    renderField(
      { multiple: true, sortable: true, value: [patrol] },
      fieldPath,
      { a: 1 },
    );
    const options = screen.getByTestId('options');
    expect(options).toHaveAttribute('data-path', 'actor/list/id:b1/options');
    expect(options).toHaveTextContent('{"a":1}');
  });

  it('shows drag handles only on sortable lists', () => {
    const { rerender } = renderField(
      { multiple: true, value: [patrol] },
      fieldPath,
    );
    expect(screen.queryByTestId('script-entry-handle')).not.toBeInTheDocument();

    rerender({ multiple: true, sortable: true, value: [patrol] });
    expect(screen.getByTestId('script-entry-handle')).toBeInTheDocument();
  });

  it('shows the field label', () => {
    renderField({ multiple: true, label: 'Filter Effects' }, fieldPath);
    expect(screen.getByText('Filter Effects')).toBeInTheDocument();
  });

  it('labels the add picker from the kind', () => {
    const t = jest.requireMock('react-i18next').mockT as jest.Mock;
    renderField({ multiple: true, kind: 'filterEffect' }, fieldPath);
    expect(t).toHaveBeenCalledWith('scriptField.add', {
      name: 'Filter Effect',
    });
  });
});
