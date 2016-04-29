import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

describe('reducer', () => {

  it('handles FOCUS', () => {
    testSimpleReducer(
      {}, // mods to standard default state

      {   // action to dispatch
        type: 'FOCUS',
        focusedService: 'baby'
      },

      {   // expected changes to initial state
        focusedService: 'baby'
      }
    );
  });

  it('handles DEFOCUS', () => {
    testSimpleReducer(
      {   // mods to standard default state
        focusedService: 'baby'
      },

      {   // action to dispatch
        type: 'DEFOCUS',
      },

      {   // expected changes to initial state
        focusedService: null
      }
    );
  });
});
