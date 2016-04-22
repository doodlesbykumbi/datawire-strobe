import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducer';

import App from './components/App';
import { RouteTable } from './components/RouteTable';

import Stroboscope from './stroboscope';

import { quark } from 'quark';
import { token } from 'token';

console.log("Stroboscope", Stroboscope);
window.Stroboscope = Stroboscope;

// Fire up our logger...
var logger = new quark.concurrent.Context.runtime().logger("dwiki-ui");

// ...and our Redux store.
const store = createStore(reducer);

window.store = store;

store.dispatch({
  type: 'DEFAULT',
  logger: logger
});

store.dispatch({
  type: "LOGIN",
  user: {
    email: "flynn@datawire.io",
    name: "Flynn",
    token: token
  }
});

store.dispatch({
  type: 'UPDATE',
  routes: {
    'grue-locator': [ 'gl-1', 'gl-2', 'gl-3' ],
    'grue-adder': [ 'ga-1', 'ga-2', 'ga-3' ],
    'grue-remover': [ 'gr-1', 'gr-2', 'gr-3' ]
  }
});

  // <Route path="/" component={LoginOrSignupContainer} />
  // <Route path="/article" component={ArticleContainer} />
  // <Route path="/editor" component={EditorContainer} />

const routes = <Route component={App}>
  <Route path="/" component={RouteTable} />
</Route>;

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
