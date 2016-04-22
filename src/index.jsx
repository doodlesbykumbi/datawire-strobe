import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducer';

import App from './components/App';
import { LoginOrSignup } from './components/LoginOrSignup';
import { RouteTable } from './components/RouteTable';

import { quark } from 'quark';

// Fire up our logger...
var logger = new quark.concurrent.Context.runtime().logger("stobe");

// ...and our Redux store.
const store = createStore(reducer);

window.store = store;

store.dispatch({
  type: 'DEFAULT',
  logger: logger
});

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
