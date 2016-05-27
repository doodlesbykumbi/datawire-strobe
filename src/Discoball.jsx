import Stroboscope from './stroboscope';
import { Strobe as DWCStrobe } from 'Strobe';

import { datawire_connect } from 'Identity';
const IdentityClient = datawire_connect.identity.Client;

console.log("Stroboscope", Stroboscope);
window.Stroboscope = Stroboscope;
window.DWCStrobe = DWCStrobe;

window.IdentityClient = IdentityClient;

export default class Discoball {
  constructor(dispatch, logger, identityURL, discoHost) {
    this.dispatch = dispatch;
    this.logger = logger;
    this.email = null;
    this.orgID = null;
    this.token = null;

    this.identityURL = identityURL ? identityURL : "https://identity.datawire.io";
    this.discoHost = discoHost ? discoHost : "disco.datawire.io";
  }

  login(email, password) {
    if ((typeof(email) != "string") || (email.length < 1)) {
      this.logger.error("can't log in with no email");
      this.loginFailed("can't log in with no email");
      return;
    }

    if ((typeof(password) != "string") || (password.length < 1)) {
      this.logger.error("can't log in with no password");
      this.loginFailed("can't log in with no password");
      return;
    }

    this.logger.info("Logging into " + this.identityURL + " as " + email);

    var idc = new IdentityClient(this.identityURL);
    var lr = idc.login(email, password);

    lr.onFinished({
      onFuture: (result) => {
        if (result.getError()) {
          this.loginFailed(result.getError());
        }
        else {
          this.loginSucceeded(email, result.orgID, result.token)
        }
      }
    });
  }

  signup(orgName, adminName, adminEmail, adminPassword1, adminPassword2) {
    if ((typeof(orgName) != "string") || (orgName.length < 1)) {
      this.logger.error("can't sign up with no orgName");
      this.signupFailed("can't sign up with no orgName");
      return;
    }

    if ((typeof(adminName) != "string") || (adminName.length < 1)) {
      this.logger.error("can't sign up with no adminName");
      this.signupFailed("can't sign up with no adminName");
      return;
    }

    if ((typeof(adminEmail) != "string") || (adminEmail.length < 1)) {
      this.logger.error("can't sign up with no adminEmail");
      this.signupFailed("can't sign up with no adminEmail");
      return;
    }

    if ((typeof(adminPassword1) != "string") || (adminPassword1.length < 1)) {
      this.logger.error("can't sign up with no adminPassword1");
      this.signupFailed("can't sign up with no adminPassword1");
      return;
    }

    if (adminPassword1 != adminPassword2) {
      this.logger.error("can't sign up with no adminPassword1");
      this.signupFailed("can't sign up with no adminPassword1");
      return;
    }

    this.logger.info("Signing up at " + this.identityURL + " as [" + orgName + "]" + adminEmail);

    var idc = new IdentityClient(this.identityURL);
    var lr = idc.signup(orgName, adminName, adminEmail, adminPassword1);

    lr.onFinished({
      onFuture: (result) => {
        if (result.getError()) {
          this.signupFailed(result.getError());
        }
        else {
          this.signupSucceeded(orgName, adminEmail, result.orgID, result.token)
        }
      }
    });
  }

  loginFailed(errorMessage) {
    this.dispatch({
      type: "ERROR",
      error: "Login failed! " + errorMessage
    });
  }

  loginSucceeded(email, orgID, token) {
    console.log("loginSucceeded: orgID " + orgID);

    this.processLogin(email, orgID, token);
  }

  signupFailed(errorMessage) {
    this.dispatch({
      type: "ERROR",
      error: "Login failed! " + errorMessage
    });
  }

  signupSucceeded(orgName, adminEmail, orgID, token) {
    console.log("signupSucceeded: orgID " + orgID);

    this.processLogin(adminEmail, orgID, token);
  }

  processLogin(email, orgID, token) {
    this.email = email;
    this.orgID = orgID;
    this.token = token;

    if (typeof(localStorage) != 'undefined') {
      this.logger.info("Updating local storage with login info");

      localStorage.setItem("io.datawire.strobe", JSON.stringify({
        email: this.email,
        orgID: this.orgID,
        token: this.token
      }));
    }

    this.dispatch({
      type: "OK"
    });

    this.dispatch({
      type: "LOGIN",
      user: {
        email: this.email,
        orgID: this.orgID,
        token: this.token
      }
    });

    // While we're at it, let's get the stroboscope running.
    var stroboscope = new Stroboscope(this.dispatch);
    var strobe = DWCStrobe.Strobe.watchingHost(this.discoHost, this.token, stroboscope);

    this.dispatch({ type: 'SET_STROBE', strobe: strobe });

    window.location = '#/dashboard';
  }
}
