import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducer';

import App from './components/App';
import { LoginOrSignup } from './components/LoginOrSignup';
import { RouteTable } from './components/RouteTable';

import Stroboscope from './stroboscope';

import { quark } from 'quark';

console.log("Stroboscope", Stroboscope);
window.Stroboscope = Stroboscope;

// Fire up our logger...
var logger = new quark.concurrent.Context.runtime().logger("stobe");

// ...and our Redux store.
const store = createStore(reducer);

window.store = store;

store.dispatch({
  type: 'DEFAULT',
  logger: logger
});

// store.dispatch({
//   type: 'UPDATE',
//   routes: {
//     'grue-locator': [ 'gl-1', 'gl-2', 'gl-3' ],
//     'grue-adder': [ 'ga-1', 'ga-2', 'ga-3' ],
//     'grue-remover': [ 'gr-1', 'gr-2', 'gr-3' ]
//   }
// });

const routes = <Route component={App}>
  <Route path="/" component={LoginOrSignup} />
  <Route path="/routes" component={RouteTable} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
