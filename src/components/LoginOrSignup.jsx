import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

import Stroboscope from '../stroboscope';
import { Strobe as DWCStrobe } from 'strobe';

import { datawire_connect } from 'Identity';
const IdentityClient = datawire_connect.identity.Client;

console.log("Stroboscope", Stroboscope);
window.Stroboscope = Stroboscope;
window.DWCStrobe = DWCStrobe;

window.IdentityClient = IdentityClient;

// import { token } from 'token';

const LoginOrSignupCore = React.createClass({
  mixins: [ PureRenderMixin ],

  doLogin: function() {
    // window.location = "#";

    var email = this.refs.loginEmail.value;
    var password = this.refs.loginPassword.value;

    this.props.logger.info("Starting login as " + email);

    var idc = new IdentityClient("https://identity.datawire.io");
    var lr = idc.login(email, password);

    lr.onFinished({
      onFuture: (result) => {
        if (result.getError()) {
          this.props.dispatch({
            type: "ERROR",
            error: "Login failed! " + result.getError()
          });
        }
        else {
          var orgID = result.orgID;
          var token = result.token;

          console.log("LOGGED IN! orgID " + orgID);

          this.props.dispatch({
            type: "OK"
          });

          this.props.dispatch({
            type: "LOGIN",
            user: {
              email: "flynn@datawire.io",
              name: "Flynn",
              token: token
            }
          });

          // While we're at it, let's get the stroboscope running.
          var stroboscope = new Stroboscope(this.props.dispatch);
          var strobe = DWCStrobe.Strobe.watchingHost("disco.datawire.io", token, stroboscope);

          this.props.dispatch({ type: 'SET_STROBE', strobe: strobe });

          window.location = '#/routes';
        }
      }
    });
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
            <br />
            <span>Email: </span><input type="text" width="40" ref="loginEmail" />
            <br />
            <span>Password: </span><input type="password" width="40" ref="loginPassword" />
            <br />
            <button onClick={ this.doLogin }>GO</button>
          </div>
        </div>
      </div>;
    }
  }
});

export const LoginOrSignup = mapStrobeState(LoginOrSignupCore);
