jest.mock('../../../../../components', () => ({
  Icon: (): null => null,
  IconButton: (): null => null,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Section } from '..';
import { NewItemContext } from '../../new-item-tracker';

describe('Section', () => {
  it('keeps an explicit defaultOpen over the list item state', () => {
    render(
      <NewItemContext.Provider value>
        <Section title="Condition 1" defaultOpen={false}>
          <div>content</div>
        </Section>
      </NewItemContext.Provider>,
    );

    expect(screen.getByText('content')).not.toBeVisible();
  });

  it('does not pass the new item state to the sections inside it', () => {
    render(
      <NewItemContext.Provider value>
        <Section title="Behavior">
          <Section title="Options">
            <div>options</div>
          </Section>
        </Section>
      </NewItemContext.Provider>,
    );

    expect(screen.getByText('Options')).toBeVisible();
    expect(screen.getByText('options')).not.toBeVisible();
  });

  it('stays open when its title changes', () => {
    const { rerender } = render(
      <Section title="Condition 2" defaultOpen>
        <div>content</div>
      </Section>,
    );

    rerender(
      <Section title="Condition 1" defaultOpen>
        <div>content</div>
      </Section>,
    );

    expect(screen.getByText('content')).toBeVisible();
  });
});
