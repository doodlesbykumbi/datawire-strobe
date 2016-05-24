package Identity 1.0.0;

// use ./quark-improvements.q;

import quark.concurrent;
// import nice;

namespace datawire_connect {
  @doc("Quark interface to the Datawire Connect Identity service")
  namespace identity {
    @doc("CommonResponse is a Future that carries a set of mandatory field names.")
    @doc("It is the base class used for responses to API calls that return a JSON")
    @doc("dictionary, or a DatawireResult.")
    class CommonResponse extends Future {
      // XXX I would've used a static for this, but I can't figure out how to 
      // initialize it.
      List<String> required;
    }

    @doc("LoginResponse is a Future that carries the two things we care about")
    @doc("from Identity's v1/auth POST call.")
    class LoginResponse extends CommonResponse {
      String orgID;
      String token;
      
      LoginResponse() {
        super();
        self.required = [ "orgID", "token" ];
      }
    }

    @doc("SignupResponse is a Future that carries the two things we care about")
    @doc("from Identity's v1/orgs POST call.")
    class SignupResponse extends CommonResponse {
      String orgID;
      String token;
      
      SignupResponse() {
        super();
        self.required = [ "orgID", "token" ];
      }
    }

    @doc("IdentityListener is really an impedance matcher between the Runtime's")
    @doc("HTTPHandler and Future, with additional logic for the DatawireResult")
    @doc("object that Identity slings around.")

    @doc("Most of this class should be in the standard library.")
    class IdentityListener extends HTTPHandler {
      String reqID;
      CommonResponse response;
      Logger logger;

      @doc("Params:")
      @doc("reqID: a request ID, used only for tracing")
      @doc("response: the CommonResponse object to be filled in when this call completes")
      @doc("logger: Logger to use for debugging and tracing")
      IdentityListener(String reqID, CommonResponse response, Logger logger) {
        self.reqID = reqID;
        self.response = response;
        self.logger = logger;
      }

      // onHTTPInit gets called whenever our HTTP connection is completed and
      // we're ready to make calls over it.
      void onHTTPInit(HTTPRequest request) {
        self.logger.trace("onHTTPInit for " + self.reqID);
      }

      // onHTTPResponse gets called whenever our HTTP request has succeeded and
      // we have the server's final response.
      void onHTTPResponse(HTTPRequest request, HTTPResponse response) {
        JSONObject results = null;          // results from call

        int code = response.getCode();      // HTTP status code
        String body = response.getBody();   // just to save keystrokes later

        self.logger.trace("onHTTPResponse for " + self.reqID + ": " + 
                          code.toString());
        self.logger.trace("body: " + body);

        if (code == 200) {
          // All good. Parse the JSON in the body...
          results = body.parseJSON();

          // ...and then grab all the required fields from the response.          
          List<String> required = self.response.required;

          // XXX !*@&#*!&#@ lack-of-a-for-statement......
          int i = 0;

          while (i < required.size()) {
            String key = required[i];

            // XXX We should really check to make sure we got a value here...
            String value = results[key];

            self.logger.trace("copying " + key + ": " + value);

            self.response.setField(key, value);
            i = i + 1;
          }

          // Once that's all done, we can finish the response.
          self.response.finish(null);
        }
        else {
          // Per the HTTP status code, something has gone wrong. Try to pull a
          // sensible error out of the body...
          String error = "";

          if (body.size() > 0) {
            results = body.parseJSON();

            error = results["error"];
          }

          // In any case, if we have no error, synthesize something from the
          // status code.
          if (error.size() < 1) {
            error = "HTTP response " + code.toString();
          }

          self.response.finish(error);
        }
      }

      void onHTTPError(HTTPRequest request, String message) {
        // This seems to just be informational.
        self.logger.trace("onHTTPError for " + self.reqID + ": " + message);
      }

      void onHTTPFinal(HTTPRequest request) {
        // This seems to just be informational.
        self.logger.trace("onHTTPFinal for " + self.reqID);
      }
    }

    @doc("Client is the main public interface to Identity.")
    class Client {
      static Logger logger = new Logger("identity.client");

      String baseURL;
      Runtime runtime;

      @doc("Create a Client connected to baseURL. If no baseURL is given,")
      @doc("https://disco.datawire.io is assumed.")
      Client(String baseURL) {
        if ((baseURL == null) || (baseURL.size() < 1)) {
          baseURL = "https://disco.datawire.io";
        }

        self.baseURL = baseURL;

        // XXX Is it really safe to cache the Runtime like this?
        self.runtime = concurrent.Context.runtime();
      }

      @doc("Make a URL given a base URL and path elements.")
      String makeURL(List<String> elements) {
        return self.baseURL + "/" + "/".join(elements);
      }

      // XXX doPOST should be in the standard library: literally all it does
      // is an HTTP POST call.
      @doc("doPOST does a POST operation, as one might expect.")
      @doc("reqID is a human-readable request ID for logging/tracing")
      @doc("urlElements is an array of URL path elements")
      @doc("params is a set of parameters which will be JSON-encoded as the request body")
      @doc("response is a CommonResponse which will receive the response; it will be")
      @doc("marked finished only when the request is complete (one way or the other)")
      CommonResponse doPOST(String reqID, List<String> urlElements, Map<String, String> params,
                            CommonResponse response) {
        // Grab the full URL...
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

        // ...and then create an !@*#!&@#*& IdentityListener to handle the response.
        // Sigh.
        IdentityListener listener = new IdentityListener(reqID, response, logger);

        // Off we go.
        HTTPRequest req = new HTTPRequest(url);

        req.setMethod("POST");
        req.setBody(jsonParams);
        req.setHeader("Content-Type", "application/json");
        self.runtime.request(req, listener);

        return response;
      }

      @doc("Make a login request")
      LoginResponse login(String email, String password) {
        return ?self.doPOST(email, [ "v1", "auth", email ],
                            { "password": password }, new LoginResponse());
      }

      @doc("Make a signup request")
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
