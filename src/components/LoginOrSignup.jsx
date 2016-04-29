import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const LoginOrSignupCore = React.createClass({
  mixins: [ PureRenderMixin ],

  doLogin: function(e) {
    e.preventDefault();

    var email = this.refs.loginEmail.value;
    var password = this.refs.loginPassword.value;
    var discoball = this.props.discoball;

    discoball.login(email, password);
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
          <form>
            <div className="user-info-missing">You are not currently logged in.
              <br />
              <span>Email: </span><input type="text" width="40" ref="loginEmail" autoFocus="true" />
              <br />
              <span>Password: </span><input type="password" width="40" ref="loginPassword" />
              <br />
              <input type="submit" value="GO" onClick={ this.doLogin } />
            </div>
          </form>
        </div>
      </div>;
    }
  }
});

export const LoginOrSignup = mapStrobeState(LoginOrSignupCore);
