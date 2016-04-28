import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles FOCUS', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null,
      focusedService: null,
      strobe: null
    });

    const action = {
      type: 'FOCUS',
      focusedService: 'baby'
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null,
      focusedService: 'baby',
      strobe: null      
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles DEFOCUS', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null,
      focusedService: 'baby',
      strobe: null
    });

    const action = {
      type: 'DEFOCUS'
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null,
      focusedService: null,
      strobe: null      
    }));

    expect(nextState).to.not.equal(initialState);
  });
});
