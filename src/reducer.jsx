import combineReducers from 'redux-immutable-combine-reducers';

import user from './reduceUser';
import routes from './reduceRoutes';

// Dirt simple logger "reducer" that allows only saving the logger.
function logger(state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return action.logger ? action.logger : null;

    default:
      return state;
  }
}

const reducer = combineReducers({ user, routes, logger });

export default reducer;

