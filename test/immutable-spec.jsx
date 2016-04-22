import {expect} from 'chai';
import * as immutable from 'immutable';

describe('immutability', () => {

  // ...

  describe('a tree', () => {

    function addMovie(currentState, movie) {
      return currentState.update(
        'movies',
        movies => movies.push(movie)
      );
    }

    it('is immutable', () => {
      let state = immutable.fromJS({
        movies: [ 'Trainspotting', '28 Days Later' ]
      });

      let nextState = addMovie(state, 'Sunshine');

      expect(nextState != state);

      expect(immutable.is(nextState, immutable.fromJS({
        movies: [ 'Trainspotting', '28 Days Later', 'Sunshine' ]
      })));

      expect(immutable.is(state, immutable.fromJS({
        movies: [ 'Trainspotting', '28 Days Later' ]
      })));
    });

  });

});
