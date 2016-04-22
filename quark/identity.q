package Identity 1.0.0;

import quark.concurrent;

namespace datawire_connect {
  namespace identity {
    // LoginResponse is a Future that carries the two things we care about
    // from Identity's userAuth method.

    class LoginResponse extends Future {
      String orgID;
      String token;
    }

    // LoginListener is really an impedance matcher between the Runtime's
    // HTTPHandler and Future, with additional logic for the DatawireResult
    // object that Identity slings around.
    // 
    // Most of this class should be in the standard library.

    class LoginListener extends HTTPHandler {
      String email;
      LoginResponse response;
      Logger logger;

      LoginListener(String email, LoginResponse response, Logger logger) {
        self.email = email;
        self.response = response;
        self.logger = logger;
      }

      void onHTTPInit(HTTPRequest request) {
        self.logger.trace("onHTTPInit for " + self.email);
      }

      void onHTTPResponse(HTTPRequest request, HTTPResponse response) {
        int code = response.getCode();
        JSONObject results = null;
        String body = response.getBody();

        self.logger.trace("onHTTPResponse for " + self.email + ": " + 
                          code.toString());
        self.logger.trace("body: " + body);

        if (code == 200) {
          // All good.
          results = response.getBody().parseJSON();

          self.response.orgID = results["orgID"];
          self.response.token = results["token"];

          self.logger.info("auth good for " + self.email +
                           " in org " + self.response.orgID);

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

          self.logger.info("auth failed for " + self.email + ": " + error);

          self.response.finish(error);
        }
      }

      void onHTTPError(HTTPRequest request, String message) {
        self.logger.trace("onHTTPError for " + self.email + ": " + message);
      }

      void onHTTPFinal(HTTPRequest request) {
        self.logger.trace("onHTTPFinal for " + self.email);
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

      LoginResponse login(String email, String password) {
        String url = self.makeURL([ "v1", "auth", email ]);

        // // AUGH. We can't serialize Maps to JSON right now. Sigh.
        // Map<String, String> params = new Map<String,String>();
        // params["password"] = password;
        // logger.trace("params[pw]: " + params["password"]);

        // JSONObject jParams = params.toJSON();
        // String jsonParams = jParams.toString();

        String jsonParams = "{ \"password\": \"" + password + "\" }";
        // logger.trace("jsonParams: " + jsonParams);

        LoginResponse response = new LoginResponse();
        LoginListener listener = new LoginListener(email, response, logger);

        HTTPRequest req = new HTTPRequest(url);

        req.setMethod("POST");
        req.setBody(jsonParams);
        req.setHeader("Content-Type", "application/json");
        self.runtime.request(req, listener);

        return response;
      }
    }
  }
}
