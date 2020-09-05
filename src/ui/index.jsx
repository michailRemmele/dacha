import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Switch, Route } from 'react-router';

import SceneSwitcher from './elements/components/sceneSwitcher/SceneSwitcher';

import MainMenu from './elements/pages/mainMenu/MainMenu';
import Game from './elements/pages/game/Game';
import Circles from './elements/pages/circles/Circles';
import BoxesAndCircles from './elements/pages/boxesAndCircles/BoxesAndCircles';

export function onInit(options) {
  const { sceneName } = options;

  ReactDOM.render(
    <MemoryRouter>
      <SceneSwitcher sceneName={sceneName}>
        <Switch>
          <Route path='/mainMenu'>
            <MainMenu/>
          </Route>
          <Route path='/game'>
            <Game/>
          </Route>
          <Route path='/circles'>
            <Circles/>
          </Route>
          <Route path='/boxesAndCircles'>
            <BoxesAndCircles/>
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
