import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

const UserInfoCore = React.createClass({
  mixins: [ PureRenderMixin ],

  doLogout: function() {
    this.props.dispatch({ type: 'LOGOUT' });
    window.location = "#";
  },

  render: function() {
    var logger = this.props.logger;

    var orgID = undefined;
    var userEmail = undefined;

    if (this.props.user) {
      orgID = this.props.user.get('orgID');
      userEmail = this.props.user.get('email');
    }

    if ((orgID && orgID.length) &&
        (userEmail && userEmail.length)) {
      return <div className="user-info">
        Logged in as <span className="user-email">&lt;{ userEmail }&gt;</span> in organization <span className="user-org">{ orgID }</span>
        <button className="float-right" onClick={ this.doLogout }>LOGOUT</button>
      </div>;
    }
    else {
      return <div className="user-info">
        <div className="user-info-missing">You are somehow not logged in!
          <button className="float-right" onClick={ this.doLogout }>START OVER</button>
        </div>
      </div>;
    }
  }
});

export const UserInfo = mapStrobeState(UserInfoCore);
