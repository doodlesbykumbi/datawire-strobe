import { Map, fromJS } from 'immutable';

export default function (state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return null;

    case 'LOGIN':
      return fromJS(action.user).set('state', 'LOGGED_IN');

    case 'LOGOUT':
      return null;

    default:
      return state;
  }
}

