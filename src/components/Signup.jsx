import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const SignupCore = React.createClass({
  mixins: [ PureRenderMixin ],

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

    console.log("kumbiLog", this.props);

    logger.info("Login: userName " + userName);

    if (userName && userName.length) {
      logger.info("Login: logged in, going for routes");

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
      logger.info("Login: not logged in, offering buttons");

      return <div>
        <Error />
            <div className="ui center aligned middle aligned grid">
              <div className="column">
                <div className="ui very padded container">
                  <img src="https://15113-presscdn-0-99-pagely.netdna-ssl.com/wp-content/uploads/2015/12/datawire-logo-small.png" className="image" />
                </div>
                <div className="ui very padded raised segment">
                  <form className="ui large form">
                    <div>
                      <h2 className="ui center aligned header">Get Your Free Datawire Account</h2>
                      <div className="field">
                        <div className="ui input">
                          <input type="text" ref="signupOrgName" placeholder="Organisation Name" />
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui input">
                          <input type="text" ref="signupAdminName" placeholder="Admin Name" />
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui input">
                          <input type="email" ref="signupAdminEmail" placeholder="Admin Email" />
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui input">
                          <input type="password" ref="signupPassword" placeholder="Password" />
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui input">
                          <input type="password" ref="signupPassword2" placeholder="Confirm Password" />
                        </div>
                      </div>
                      <div className="ui fluid large color submit button" onClick={ this.doSignup }>Create account</div>
                    </div>

                    <div className="ui error message"></div>

                  </form>
                  <div className="ui clearing divider"></div>
                  <div className="ui center aligned text">
                    <Link className="form-secondary" to={`/`}>Already a user? <span className="underline">Login</span></Link>
                  </div>
                </div>
              </div>
            </div>
      </div>;
    }
  }
});

export const Signup = mapStrobeState(SignupCore);
