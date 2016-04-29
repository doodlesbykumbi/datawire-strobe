import combineReducers from 'redux-immutable-combine-reducers';

import user from './reduceUser';
import routes from './reduceRoutes';
import focusedService from './reduceFocusedService';

// Dirt simple logger "reducer" that allows only saving the logger.
function logger(state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return action.logger ? action.logger : null;

    default:
      return state;
  }
}

// Dirt simple discoball "reducer" that allows only saving the discoball.
function discoball(state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return action.discoball ? action.discoball : null;

    default:
      return state;
  }
}

// Dirt simple strobe "reducer" that allows only setting and clearing the strobe.
function strobe(state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return null;

    case 'SET_STROBE':
      return action.strobe;

    case 'CLEAR_STROBE':
      return null;

    default:
      return state;
  }
}

// Dirt simple error "reducer" that allows setting and clearing the error.
function error(state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return null;

    case 'ERROR':
      return action.error;

    case 'OK':
      return null;

    default:
      return state;
  }
}

const reducer = combineReducers({ user, routes, focusedService, discoball, 
                                  error, logger, strobe });

export default reducer;

