import { Map, fromJS } from 'immutable';

export default function (state = {}, action = {}) {
  switch (action.type) {
    case 'DEFAULT':
      return null;

    case 'FOCUS':
      return fromJS(action.focusedService);

    case 'DEFOCUS':
      return null;

    default:
      return state;
  }
}

