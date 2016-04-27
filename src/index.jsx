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

try {
	// Fire up our logger...
	var logger = new quark.concurrent.Context.runtime().logger("strobe");

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
}
catch (err) {
	var errStack = err.stack.split("\n");

	var stackTrace = [ <span key="error-stack-hdr" className="main-error-stack-header">{ errStack.shift() }</span> ];
	var i = 0;

	errStack.forEach((line) => {
		var k1 = "error-stack-break-" + String(i);
		var k2 = "error-stack-" + String(i);

		stackTrace.push(<br key="{ k1 }" />);
		stackTrace.push(<span key="{ k2 }" className="main-error-stack-line">{ line }</span>);
		i++;
	});

	var errDisplay = <div className="main-error">
		<div className="main-error-text">ERROR: { err.message }</div>
		<div className="main-error-stack-div">{ stackTrace }</div>
	</div>;

	ReactDOM.render(errDisplay, document.getElementById('errors'));
}
