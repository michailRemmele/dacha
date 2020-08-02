import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Switch, Route } from 'react-router';

import SceneSwitcher from './elements/components/sceneSwitcher/SceneSwitcher';

export function onInit(options) {
  const { sceneName } = options;

  ReactDOM.render(
    <MemoryRouter>
      <SceneSwitcher sceneName={sceneName}>
        <Switch>
          <Route path='/mainMenu'>
            Main menu scene
          </Route>
          <Route path='/intro'>
            Intro scene
          </Route>
          <Route path='/platformer'>
            Platformer scene
          </Route>
          <Route path='/boxes'>
            Boxes scene
          </Route>
          <Route path='/circles'>
            Circles scene
          </Route>
          <Route path='/boxesAndCircles'>
            Box and Circles scene
          </Route>
        </Switch>
      </SceneSwitcher>
    </MemoryRouter>,
    document.getElementById('ui-root')
  );
}

export function onDestroy() {
  ReactDOM.unmountComponentAtNode(
    document.getElementById('ui-root')
  );
}
