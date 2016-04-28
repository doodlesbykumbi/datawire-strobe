import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    user: state.get('user'),
    routes: state.get('routes'),
    logger: state.get('logger'),
    error: state.get('error'),
    focusedService: state.get('focusedService')
  }
}

export function mapStrobeState(componentCore) {
	return connect(mapStateToProps)(componentCore);
}
