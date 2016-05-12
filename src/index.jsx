import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import VERSION from './Version';

window.StrobeVersion = VERSION;

import Discoball from './Discoball';
import reducer from './reducer';

import App from './components/App';
import { LoginOrSignup } from './components/LoginOrSignup';
import { RouteTable } from './components/RouteTable';

import { quark } from 'quark';

try {
	// Fire up our logger...
	var logger = new quark.concurrent.Context.runtime().logger("strobe");

	// ...and our Redux store...
	const store = createStore(reducer);

	window.store = store;

	// ...and our discoball.
	var discoball = new Discoball(store.dispatch, logger);

	store.dispatch({
	  type: 'DEFAULT',
	  logger: logger,
	  discoball: discoball
	});

	// Are we already signed in?
	if (typeof(localStorage) != 'undefined') {
		var dwcJSON = localStorage.getItem("io.datawire.strobe");

		if (dwcJSON) {
			try {
		    var dwcLocalStorage = JSON.parse(dwcJSON);

		    if (dwcLocalStorage) {
		      var dwcUserEmail = dwcLocalStorage.email;
		      var dwcUserOrgID = dwcLocalStorage.orgID;
		      var dwcUserToken = dwcLocalStorage.token;

		      logger.info("found credentials: [" + dwcUserOrgID + "]" + dwcUserEmail);

		      discoball.loginSucceeded(dwcUserEmail, dwcUserOrgID, dwcUserToken);
		    }
			}
			catch (err) {
				if (err instanceof SyntaxError) {
					logger.warning("bad JSON in io.datawire.strobe! " + err.message);
					localStorage.removeItem("io.datawire.strobe");
				}
				else {
					throw err;
				}
			}

		}
  }

	const routes = <Route component={App}>
	  <Route path="/" component={LoginOrSignup} />
	  <Route path="/routes" component={RouteTable} />
	</Route>;

  ReactDOM.render(
    <span>Datawire Connect UI -- { VERSION }</span>,
    document.getElementById('version')
  );

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

		stackTrace.push(<br key={ k1 } />);
		stackTrace.push(<span key={ k2 } className="main-error-stack-line">{ line }</span>);
		i++;
	});

	console.error("ERROR: " + err.message);
	console.error(err.stack);

	var errDisplay = <div className="main-error">
		<div className="main-error-text">ERROR: { err.message }</div>
		<div className="main-error-stack-div">{ stackTrace }</div>
	</div>;

	ReactDOM.render(errDisplay, document.getElementById('errors'));
}
