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

    var userName = undefined;
    var userEmail = undefined;

    if (this.props.user) {
      userName = this.props.user.get('name');
      userEmail = this.props.user.get('email');
    }

    if (userName && userName.length) {
      return <div className="user-info">
        <div className="user-info-name">
          Logged in as <span className="user-name">{ userName }</span> <span className="user-email">&lt;{ userEmail }&gt;</span>
          <button className="floatRight" onClick={ this.doLogout }>LOGOUT</button>
        </div>
      </div>;
    }
    else {
      return <div className="user-info">
        <div className="user-info-missing">You are somehow not logged in!
          <button className="floatRight" onClick={ this.doLogout }>START OVER</button>
        </div>
      </div>;
    }
  }
});

export const UserInfo = mapStrobeState(UserInfoCore);
