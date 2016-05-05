package Identity 1.0.0;

// use ./quark-improvements.q;

import quark.concurrent;
// import nice;

namespace datawire_connect {
  namespace identity {
    // CommonResponse is a Future that carries a set of mandatory field names.
    class CommonResponse extends Future {
      // XXX I would've used a static for this, but I can't figure out how to 
      // initialize it.
      List<String> required;
    }

    // LoginResponse is a Future that carries the two things we care about
    // from Identity's userAuth method.

    class LoginResponse extends CommonResponse {
      String orgID;
      String token;
      
      LoginResponse() {
        super();
        self.required = [ "orgID", "token" ];
      }
    }

    class SignupResponse extends CommonResponse {
      String orgID;
      String token;
      
      SignupResponse() {
        super();
        self.required = [ "orgID", "token" ];
      }
    }

    // IdentityListener is really an impedance matcher between the Runtime's
    // HTTPHandler and Future, with additional logic for the DatawireResult
    // object that Identity slings around.
    // 
    // Most of this class should be in the standard library.

    class IdentityListener extends HTTPHandler {
      String reqID;
      CommonResponse response;
      Logger logger;

      IdentityListener(String reqID, CommonResponse response, Logger logger) {
        self.reqID = reqID;
        self.response = response;
        self.logger = logger;
      }

      void onHTTPInit(HTTPRequest request) {
        self.logger.trace("onHTTPInit for " + self.reqID);
      }

      void onHTTPResponse(HTTPRequest request, HTTPResponse response) {
        int code = response.getCode();
        JSONObject results = null;
        String body = response.getBody();

        self.logger.trace("onHTTPResponse for " + self.reqID + ": " + 
                          code.toString());
        self.logger.trace("body: " + body);

        if (code == 200) {
          // All good.
          results = response.getBody().parseJSON();

          int i = 0;

          List<String> required = self.response.required;

          // XXX WHY DO WE NOT HAVE FOR???
          while (i < required.size()) {
            String key = required[i];
            String value = results[key];

            self.logger.trace("copying " + key + ": " + value);

            self.response.setField(key, value);
            i = i + 1;
          }

          self.response.finish(null);
        }
        else {
          // Not so good.
          String error = "";

          if (body.size() > 0) {
            results = response.getBody().parseJSON();

            error = results["error"];
          }

          if (error.size() < 1) {
            error = "HTTP response " + code.toString();
          }

          self.response.finish(error);
        }
      }

      void onHTTPError(HTTPRequest request, String message) {
        self.logger.trace("onHTTPError for " + self.reqID + ": " + message);
      }

      void onHTTPFinal(HTTPRequest request) {
        self.logger.trace("onHTTPFinal for " + self.reqID);
      }
    }

    class Client {
      static Logger logger = new Logger("identity.client");

      String baseURL;
      Runtime runtime;

      Client(String baseURL) {
        self.baseURL = baseURL;
        self.runtime = concurrent.Context.runtime();
      }

      String makeURL(List<String> elements) {
        return self.baseURL + "/" + "/".join(elements);
      }

      // Most of login should be in the standard library: literally all it
      // does is an HTTPS POST with some JSON-encoded parameters.

      CommonResponse doPOST(String reqID, List<String> urlElements, Map<String, String> params,
                            CommonResponse response) {
        String url = self.makeURL(urlElements);

        // XXX This should work. It doesn't. cf https://github.com/datawire/quark/issues/132
        // JSONObject jParams = params.toJSON();
        // String jsonParams = jParams.toString();

        List<String> keys = params.keys();
        List<String> jParams = [];

        int i = 0;
        while (i < keys.size()) {
          String key = keys[i];
          String value = params[key];

          String nextParam = "\"" + key + "\": \"" + value + "\"";

          logger.info("nextParam " + nextParam);

          jParams.add(nextParam);

          i = i + 1;
        }

        String jsonParams = "{ " + ",".join(jParams) + " }";

        logger.trace(url + ": jsonParams: " + jsonParams);

        IdentityListener listener = new IdentityListener(reqID, response, logger);

        HTTPRequest req = new HTTPRequest(url);

        req.setMethod("POST");
        req.setBody(jsonParams);
        req.setHeader("Content-Type", "application/json");
        self.runtime.request(req, listener);

        return response;
      }

      LoginResponse login(String email, String password) {
        // String jsonParams = "{ \"password\": \"" + password + "\" }";

        return ?self.doPOST(email, [ "v1", "auth", email ],
                            { "password": password }, new LoginResponse());
      }

      SignupResponse signup(String orgName,
                            String adminName, String adminEmail, String adminPassword) {
        Map<String, String> params = {
          "orgName": orgName,
          "adminName": adminName,
          "adminEmail": adminEmail,
          "adminPassword": adminPassword
        };

        return ?self.doPOST(orgName, [ "v1", "orgs" ], params, 
                            new SignupResponse());
      }
    }
  }
}
