import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/reducer';

describe('Routes reducer', () => {

  it('handles UPDATE with data', () => {
    testSimpleReducer(
      {
        logger: 'logger',
      },

      {
        type: 'UPDATE',
        routes: fromJS({
          'grue-locator': [ 'gl-1', 'gl-2', 'gl-3 '],
          'grue-adder': [ 'ga-1', 'ga-2', 'ga-3 '],
          'grue-remover': [ 'gr-1', 'gr-2', 'gr-3 ']
        })
      },

      {
        routes: fromJS({
          'grue-locator': [ 'gl-1', 'gl-2', 'gl-3 '],
          'grue-adder': [ 'ga-1', 'ga-2', 'ga-3 '],
          'grue-remover': [ 'gr-1', 'gr-2', 'gr-3 ']
        })
      }
    );
  });

  it('handles UPDATE with no data', () => {
    testSimpleReducer(
      {
        routes: fromJS({
          'grue-locator': [ 'gl-1', 'gl-2', 'gl-3 '],
          'grue-adder': [ 'ga-1', 'ga-2', 'ga-3 '],
          'grue-remover': [ 'gr-1', 'gr-2', 'gr-3 ']
        }),
        logger: 'logger',
      },

      {
        type: 'UPDATE',
        routes: {}
      },

      {
        routes: {}
      }
    );
  });
});
