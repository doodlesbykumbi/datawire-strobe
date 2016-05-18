import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';

import { mapStrobeState } from '../utils';

import { Error } from './Error';
import { UserInfo } from './UserInfo';

const LoginCore = React.createClass({
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

    console.log("kumbiLog", this.props);

    logger.info("Login: userName " + userName);

    if (userName && userName.length) {
      logger.info("Login: logged in, going for routes");

      setTimeout(() => {
        window.location = '#/dashboard';
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

        <div className="authentication ui center aligned middle aligned grid">
          <div className="column">
            <div className="ui very padded container">
              <img  src="https://15113-presscdn-0-99-pagely.netdna-ssl.com/wp-content/uploads/2015/12/datawire-logo-small.png" className="image" />
            </div>
            <div className="ui very padded raised segment">
              <form className="ui large form">
                <div>
                  <h2 className="ui center aligned">Login to your account</h2>
                  <div className="field">
                    <div className="ui input">
                      <input type="text" name="email" ref="loginEmail" placeholder="E-mail address" />
                    </div>
                  </div>
                  <div className="field">
                    <div className="ui input">
                      <input type="password" name="password" ref="loginPassword" placeholder="Password" />
                    </div>
                  </div>
                  <div className="field text-right">
                    <a className="form-secondary" href="">Forgot Password?</a>
                  </div>
                  <input className="ui fluid large color submit button" type="submit" value="Login" onClick={ this.doLogin } />
                </div>

                <div className="ui error message"></div>

              </form>
              <div className="ui clearing divider"></div>
              <div className="ui center aligned text">
                <Link className="form-secondary" to={`/signup`}>Not a member? <span className="underline">Create your free account</span></Link>
              </div>
            </div>
          </div>

        </div>


      </div>;
    }
  }
});

export const Login = mapStrobeState(LoginCore);
