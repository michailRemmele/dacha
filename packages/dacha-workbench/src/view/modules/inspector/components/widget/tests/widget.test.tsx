const mockFieldSpy = jest.fn();
jest.mock('../../field', () => ({
  Field: (props: Record<string, unknown>): null => {
    mockFieldSpy(props);
    return null;
  },
}));

const mockSectionSpy = jest.fn();
jest.mock('../../section', () => ({
  Section: (props: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
  }): React.ReactElement => {
    mockSectionSpy(props);
    return <div data-testid="section">{props.children}</div>;
  },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Widget } from '..';
import type { Field } from '../../../../../../types/widget-schema';

beforeEach(() => {
  mockFieldSpy.mockClear();
  mockSectionSpy.mockClear();

  Object.defineProperty(window, 'electron', {
    writable: true,
    value: {
      getEditorConfig: () => ({ formatWidgetNames: true }),
    },
  });
});

describe('Widget', () => {
  it('renders unsectioned fields flat, without a Section wrapper', () => {
    const fields: Field[] = [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
    ];

    render(<Widget path={[]} fields={fields} />);

    expect(screen.queryByTestId('section')).not.toBeInTheDocument();
    expect(mockFieldSpy).toHaveBeenCalledTimes(2);
    expect(mockFieldSpy.mock.calls[0][0]).toMatchObject({ name: 'a' });
    expect(mockFieldSpy.mock.calls[1][0]).toMatchObject({ name: 'b' });
  });

  it('wraps contiguous same-section fields in one Section and passes its title/defaultOpen through', () => {
    const fields: Field[] = [
      { name: 'mass', type: 'number', section: 'Dynamics' },
      { name: 'gravityScale', type: 'number', section: 'Dynamics' },
    ];

    render(
      <Widget
        path={[]}
        fields={fields}
        sections={{ Dynamics: { defaultOpen: true } }}
      />,
    );

    expect(screen.getAllByTestId('section')).toHaveLength(1);
    expect(mockSectionSpy).toHaveBeenCalledTimes(1);
    expect(mockSectionSpy.mock.calls[0][0]).toMatchObject({
      title: 'Dynamics',
      defaultOpen: true,
    });
    expect(mockFieldSpy).toHaveBeenCalledTimes(2);
  });

  it('defaults a section missing from the sections map to closed', () => {
    const fields: Field[] = [
      { name: 'mass', type: 'number', section: 'Dynamics' },
    ];

    render(<Widget path={[]} fields={fields} />);

    expect(mockSectionSpy.mock.calls[0][0]).toMatchObject({
      defaultOpen: undefined,
    });
  });

  it('renders a section name repeated non-adjacently as two separate Section instances', () => {
    const fields: Field[] = [
      { name: 'a', type: 'number', section: 'Physics' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number', section: 'Physics' },
    ];

    render(<Widget path={[]} fields={fields} />);

    expect(screen.getAllByTestId('section')).toHaveLength(2);
  });

  it('formats a camelCase section name into a display title, the same way widget names are formatted', () => {
    const fields: Field[] = [
      { name: 'oneWay', type: 'boolean', section: 'oneWay' },
      { name: 'oneWayNormal', type: 'vector', section: 'oneWay' },
    ];

    render(<Widget path={[]} fields={fields} />);

    expect(mockSectionSpy.mock.calls[0][0]).toMatchObject({ title: 'One Way' });
  });

  it('strips the schema-only "section" property before passing field props down to Field', () => {
    const fields: Field[] = [
      { name: 'mass', type: 'number', section: 'Dynamics' },
    ];

    render(<Widget path={[]} fields={fields} />);

    expect(mockFieldSpy).toHaveBeenCalledTimes(1);
    expect(mockFieldSpy.mock.calls[0][0]).not.toHaveProperty('section');
  });
});
