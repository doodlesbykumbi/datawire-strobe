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
      error: null,
      strobe: null      
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
      error: null,
      strobe: null
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles ERROR', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null,
      strobe: null
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
      error: "Oh NO!!",
      strobe: null      
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles OK', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!",
      strobe: null     
    });

    const action = {
      type: 'OK'
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: null,
      strobe: null
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles SET_STROBE', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!",
      strobe: null     
    });

    const action = {
      type: 'SET_STROBE',
      strobe: "strobe baby strobe"
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!",
      strobe: "strobe baby strobe"
    }));

    expect(nextState).to.not.equal(initialState);
  });

  it('handles CLEAR_STROBE', () => {
    const initialState = fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!",
      strobe: "strobe baby strobe"
    });

    const action = {
      type: 'CLEAR_STROBE'
    };
    
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      user: "user",
      routes: "routes",
      logger: "foo",
      error: "Oh NO!!",
      strobe: null     
    }));

    expect(nextState).to.not.equal(initialState);
  });
});
