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

  doSignup: function(e) {
    e.preventDefault();

    var signupOrgName = this.refs.signupOrgName.value;
    var signupAdminName = this.refs.signupAdminName.value;
    var signupAdminEmail = this.refs.signupAdminEmail.value;
    var signupPassword = this.refs.signupPassword.value;
    var signupPassword2 = this.refs.signupPassword2.value;

    var discoball = this.props.discoball;

    discoball.signup(signupOrgName,signupAdminName,signupAdminEmail,
                     signupPassword,signupPassword2);
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
      logger.info("LoginOrSignup: not logged in, offering buttons");

      return <div>
        <Error />
        <div className="user-info">
          <div className="user-info-missing">You are not currently logged in.</div>
          <div className="login-or-signup-div">
            <div className="login-div">
              <form>
              <table className="login-table"><tbody>
                <tr className="login-table-row">
                  <td className="login-table-cell login-table-label login-header">LOGIN</td>
                </tr>
                <tr className="login-table-row">
                  <td className="login-table-cell login-table-label login-email">Email:</td>
                  <td className="login-table-cell login-table-input login-email-input">
                    <input type="text" width="80" ref="loginEmail" autoFocus="true" />
                  </td>
                </tr>
                <tr className="login-table-row">
                  <td className="login-table-cell login-table-label login-password">Password:</td>
                  <td className="login-table-cell login-table-input login-password-input">
                    <input type="password" width="80" ref="loginPassword" />
                  </td>
                </tr>
              </tbody></table>
              <input type="submit" value="GO" onClick={ this.doLogin } />
              </form>
            </div>
            <div className="signup-div">
              <form>
              <table className="signup-table"><tbody>
                <tr className="signup-table-row">
                  <td className="signup-table-cell signup-table-label signup-header">SIGNUP</td>
                </tr>
                <tr className="signup-table-row">
                  <td className="signup-table-cell signup-table-label signup-orgname">Organization Name:</td>
                  <td className="signup-table-cell signup-table-input signup-orgname-input">
                    <input type="text" width="80" ref="signupOrgName" />
                  </td>
                </tr>
                <tr className="signup-table-row">
                  <td className="signup-table-cell signup-table-label signup-adminname">Admin Name:</td>
                  <td className="signup-table-cell signup-table-input signup-adminname-input">
                    <input type="text" width="80" ref="signupAdminName" />
                  </td>
                </tr>
                <tr className="signup-table-row">
                  <td className="signup-table-cell signup-table-label signup-adminemail">Admin Email:</td>
                  <td className="signup-table-cell signup-table-input signup-adminemail-input">
                    <input type="text" width="80" ref="signupAdminEmail" />
                  </td>
                </tr>
                <tr className="signup-table-row">
                  <td className="signup-table-cell signup-table-label signup-password">Password:</td>
                  <td className="signup-table-cell signup-table-input signup-password-input">
                    <input type="password" width="80" ref="signupPassword" />
                  </td>
                </tr>
                <tr className="signup-table-row">
                  <td className="signup-table-cell signup-table-label signup-password2">Confirm Password:</td>
                  <td className="signup-table-cell signup-table-input signup-password2-input">
                    <input type="password" width="80" ref="signupPassword2" />
                  </td>
                </tr>
              </tbody></table>
              <input type="submit" value="GO" onClick={ this.doSignup } />
              </form>
            </div>
          </div>
        </div>
      </div>;
    }
  }
});

export const LoginOrSignup = mapStrobeState(LoginOrSignupCore);
