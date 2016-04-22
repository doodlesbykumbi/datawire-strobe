import { Map, fromJS } from 'immutable';

export default function (state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return Map();

    case 'UPDATE':
      return fromJS(action.routes);

    default:
      return state;
  }
}

