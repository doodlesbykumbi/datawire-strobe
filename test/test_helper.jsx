import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import { expect } from 'chai';

import { List, Map, fromJS } from 'immutable';

import reducer from '../src/reducer';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);

// Blatant hackery here.
global.testInitialState = function (additions) {
  var initialState = fromJS({
    user: null,
    routes: {},
    focusedService: null,
    discoball: null,
    error: null,
    logger: null,
    strobe: null
  });

  if (additions) {
    initialState = initialState.merge(additions);
  }

  return initialState;
}

global.testSimpleReducer = function (initialAdditions, action, changes) {
  const initialState = testInitialState(initialAdditions);
  const nextState = reducer(initialState, action);
  const expectedFinalState = initialState.merge(changes);

  expect(nextState).to.equal(expectedFinalState);
  expect(nextState).to.not.equal(initialState);
}
