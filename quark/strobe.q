package Strobe 1.0.0;

// We need to use Discovery directly here...
use https://raw.githubusercontent.com/datawire/discovery/master/quark/discovery-1.0.0.q;
// use ../../discovery/quark/discovery-1.0.0.q;

// ...and we need to worry about concurrency, too.
import quark.concurrent;
import datawire_discovery;

// In your target language, the thing you'll pull into your code will
// be called "hello".
namespace Strobe {
  class StrobeDelegate {
    void connected() {}
    void routesUpdated(model.RoutingTable routingTable) {}
  }

  class Strobe extends client.CloudDiscoveryClient {
    StrobeDelegate delegate;

    static Strobe watchingHost(String hostName, String token, StrobeDelegate delegate) {
      client.GatewayOptions options = new client.GatewayOptions(token);
      options.gatewayHost = hostName;

      Strobe watcher = new Strobe(concurrent.Context.runtime(), options, null, null);

      watcher.delegate = delegate;

      self.logger.info("Connecting");
      watcher.connect();

      return watcher;
    }

    void onConnected(event.Connected connected) {
      super.onConnected(connected);
      self.logger.info("Connected");

      self.delegate.connected();

      self.subscribe();
    }

    void onRoutesResponse(message.RoutesResponse response) {
      super.onRoutesResponse(response);
      self.logger.info("RoutesResponse");

      self.delegate.routesUpdated(response.routes);
    }
  }
}
