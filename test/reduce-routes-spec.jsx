import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('Routes reducer', () => {

  it('handles UPDATE with data', () => {
    const initialState = fromJS({
      user: null,
      logger: 'logger',
      error: null,
      focusedService: null,
      strobe: null,
      routes: {}      
    });

    const action = {
      type: 'UPDATE',
      routes: fromJS({
        'grue-locator': [ 'gl-1', 'gl-2', 'gl-3 '],
        'grue-adder': [ 'ga-1', 'ga-2', 'ga-3 '],
        'grue-remover': [ 'gr-1', 'gr-2', 'gr-3 ']
      })
    };

    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: null,
      logger: 'logger',
      error: null,
      focusedService: null,
      strobe: null,
      routes: {
        'grue-locator': [ 'gl-1', 'gl-2', 'gl-3 '],
        'grue-adder': [ 'ga-1', 'ga-2', 'ga-3 '],
        'grue-remover': [ 'gr-1', 'gr-2', 'gr-3 ']
      }
    }));

    expect(nextState).to.not.equal(initialState);
  });


  it('handles UPDATE with no data', () => {
    const initialState = fromJS({
      user: null,
      logger: 'logger',
      error: null,
      focusedService: null,
      strobe: null,
      routes: {
        'grue-locator': [ 'gl-1', 'gl-2', 'gl-3 '],
        'grue-adder': [ 'ga-1', 'ga-2', 'ga-3 '],
        'grue-remover': [ 'gr-1', 'gr-2', 'gr-3 ']
      }
    });

    const action = {
      type: 'UPDATE',
      routes: {}
    };

    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: null,
      logger: 'logger',
      error: null,
      focusedService: null,
      strobe: null,
      routes: {}
    }));

    expect(nextState).to.not.equal(initialState);
  });
});
