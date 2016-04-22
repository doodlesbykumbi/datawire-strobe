import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    user: state.get('user'),
    routes: state.get('routes'),
    logger: state.get('logger'),
    error: state.get('error')
  }
}

export function mapStrobeState(componentCore) {
	return connect(mapStateToProps)(componentCore);
}
