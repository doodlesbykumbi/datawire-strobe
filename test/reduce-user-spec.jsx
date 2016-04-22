import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('User reducer', () => {

  it('handles LOGIN', () => {
    const initialState = fromJS({
      user: null,
      logger: 'logger',
      error: null,
      strobe: null,
      routes: {}      
    });

    const action = {
      type: 'LOGIN',
      user: {
        email: 'flynn@datawire.io',
        name: 'Flynn',
        token: 'boo yah'
      }
    };

    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: {
        email: 'flynn@datawire.io',
        name: 'Flynn',
        token: 'boo yah',
        state: 'LOGGED_IN'
      },
      logger: 'logger',
      error: null,
      strobe: null,
      routes: {}
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles LOGOUT', () => {
    const initialState = fromJS({
      user: {
        email: 'flynn@datawire.io',
        name: 'Flynn',
        token: 'boo yah',
        state: 'LOGGED_IN'
      },
      logger: 'logger',
      error: null,
      strobe: null,
      routes: {}     
    });

    const action = {
      type: 'LOGOUT'
    };

    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: null,
      logger: 'logger',
      error: null,
      strobe: null,
      routes: {}     
    }));

    expect(nextState).to.not.equal(initialState);
  });
});
