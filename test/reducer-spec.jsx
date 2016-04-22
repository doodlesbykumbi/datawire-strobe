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
      logger: null
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
      logger: "good"
    }));

    expect(nextState).to.not.equal(initialState);
  });
});
