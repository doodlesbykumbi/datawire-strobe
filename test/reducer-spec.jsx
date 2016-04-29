import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles DEFAULT with no data', () => {
    const initialState = testInitialState();
    const nextState = reducer(undefined, {
      type: 'DEFAULT'
    });

    expect(nextState).to.equal(initialState);
  });

  it('handles DEFAULT with initial logger and discoball', () => {
    testSimpleReducer(
      {  // mods to standard default state
        user: 'evil',
        routes: 'evil'
      },

      {   // action to dispatch
        type: 'DEFAULT',
        logger: 'good',
        discoball: 'disco baby!'
      },

      {   // expected changes to initial state
        user: null,
        routes: {},
        logger: 'good',
        discoball: 'disco baby!'
      }
    );
  });

  it('handles ERROR', () => {
    testSimpleReducer(
      {  // mods to standard default state
        user: "user",
        routes: "routes",
        logger: "foo",
      },

      {   // action to dispatch
        type: 'ERROR',
        error: "Oh NO!!"     
      },

      {   // expected changes to initial state
        error: "Oh NO!!"     
      }
    );
  });

  it('handles OK', () => {
    testSimpleReducer(
      {  // mods to standard default state
        user: "user",
        routes: "routes",
        logger: "foo",
        error: "Oh NO!!",
      },

      {   // action to dispatch
        type: 'OK'
      },

      {   // expected changes to initial state
        error: null,
      }
    );
  });

  it('handles SET_STROBE', () => {
    testSimpleReducer(
      {  // mods to standard default state
        user: "user",
        routes: "routes",
        logger: "foo",
        error: "Oh NO!!",
      },

      {   // action to dispatch
        type: 'SET_STROBE',
        strobe: "strobe baby strobe"
      },

      {   // expected changes to initial state
        strobe: "strobe baby strobe"
      }
    );
  });

  it('handles CLEAR_STROBE', () => {
    testSimpleReducer(
      {  // mods to standard default state
        user: "user",
        routes: "routes",
        logger: "foo",
        error: "Oh NO!!",
        strobe: "strobe baby strobe"
      },

      {   // action to dispatch
        type: 'CLEAR_STROBE'
      },

      {   // expected changes to initial state
        strobe: null
      }
    );
  });
});
