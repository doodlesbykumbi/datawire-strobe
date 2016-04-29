import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('User reducer', () => {

  it('handles LOGIN', () => {
    testSimpleReducer(
      {
        logger: 'logger',
      },

      {
        type: 'LOGIN',
        user: {
          email: 'flynn@datawire.io',
          name: 'Flynn',
          token: 'boo yah'
        }
      },

      {
        user: {
          email: 'flynn@datawire.io',
          name: 'Flynn',
          token: 'boo yah',
          state: 'LOGGED_IN'
        },
      }
    );
  });

  it('handles LOGOUT', () => {
    testSimpleReducer(
      {
        user: {
          email: 'flynn@datawire.io',
          name: 'Flynn',
          token: 'boo yah',
          state: 'LOGGED_IN'
        },
        logger: 'logger',
      },

      {
        type: 'LOGOUT',
      },

      {
        user: null
      }
    );
  });
});
