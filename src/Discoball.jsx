import Stroboscope from './stroboscope';
import { Strobe as DWCStrobe } from 'strobe';

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

  loginFailed(errorMessage) {
    this.dispatch({
      type: "ERROR",
      error: "Login failed! " + errorMessage()
    });
  }

  loginSucceeded(email, orgID, token) {
    this.email = email;
    this.orgID = orgID;
    this.token = token;

    console.log("loginSucceeded: this " + this);
    console.log("LOGGED IN! orgID " + this.orgID + " -- localStorage " + typeof(localStorage));

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

    window.location = '#/routes';
  }
}
