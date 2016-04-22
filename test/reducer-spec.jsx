import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles DEFAULT with no data', () => {
    const action = {
      type: 'DEFAULT'
    };

    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      user: null,
      routes: {},
      logger: null,
      error: null      
    }));
  });

  it('handles DEFAULT with initial logger', () => {
    const initialState = fromJS({
      user: "evil",
      routes: "evil"
    });

    const action = {
      type: 'DEFAULT',
      logger: "good"     
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: null,
      routes: {},
      logger: "good",
      error: null
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles ERROR', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null
    });

    const action = {
      type: 'ERROR',
      error: "Oh NO!!"     
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!"
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles OK', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!"
    });

    const action = {
      type: 'OK'
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null
    }));

    expect(nextState).to.not.equal(initialState);
  });});
