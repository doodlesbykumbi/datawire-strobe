import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

import { token } from 'token';

const LoginOrSignupCore = React.createClass({
  mixins: [ PureRenderMixin ],

  doLogin: function() {
    // window.location = "#";

    this.props.dispatch({
      type: "LOGIN",
      user: {
        email: "flynn@datawire.io",
        name: "Flynn",
        token: token
      }
    });

    window.location = '#/routes';
  },

  render: function() {
    var logger = this.props.logger;

    var userName = undefined;
    var userEmail = undefined;

    if (this.props.user) {
      userName = this.props.user.get('name');
      userEmail = this.props.user.get('email');
    }

    logger.info("LoginOrSignup: userName " + userName);

    if (userName && userName.length) {
      logger.info("LoginOrSignup: logged in, going for routes");

      setTimeout(() => {
        window.location = '#/routes';
      }, 2000);

      return <div>
        <Error />
        <UserInfo />
        <div>Waiting...</div>
      </div>;
    }
    else {
      logger.info("LoginOrSignup: not logged in, offering signup button");

      return <div>
        <Error />
        <div className="user-info">
          <div className="user-info-missing">You are not currently logged in.
            <button className="floatRight" onClick={ this.doLogin }>FAKE LOGIN</button>
            to get started!
          </div>
        </div>
      </div>;
    }
  }
});

export const LoginOrSignup = mapStrobeState(LoginOrSignupCore);
