import React, { FC } from 'react'

import {
  StateList,
  TransitionList,
  Timeline,
  Inspector,
} from './components'

import './style.less'

export const Editor: FC = () => (
  <div className="animation-editor">
    <section className="animation-editor__section">
      <section className="animation-editor__state-tree">
        <StateList className="animation-editor__state-list" />
        <TransitionList className="animation-editor__transition-list" />
      </section>
      <footer className="animation-editor__footer">
        <Timeline
          className="animation-editor__timeline"
        />
      </footer>
    </section>
    <aside className="animation-editor__aside">
      <Inspector />
    </aside>
  </div>
)
