import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

const ErrorCore = React.createClass({
  mixins: [ PureRenderMixin ],

  render: function() {
    var logger = this.props.logger;
    var errorText = this.props.error || undefined;

    if (errorText && errorText.length) {
      return <div className="error">ERROR: <span className="error-text">{ errorText }</span></div>;
    }
    else {
      return <div />;
    }
  }
});

export const Error = mapStrobeState(ErrorCore);
