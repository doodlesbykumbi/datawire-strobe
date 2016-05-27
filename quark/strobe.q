package Strobe 1.0.0;

// We need to use Discovery directly here...
use https://raw.githubusercontent.com/datawire/discovery/master/quark/discovery-1.0.0.q;

// ...and we need to worry about concurrency, too.
import quark.concurrent;
import datawire_discovery;

@doc("Strobe is an impedence matcher between the target-language app, the")
@doc("identity service, and the discoball. As such it is _the_ thing that the")
@doc("target-language app should be interacting with.")

@doc("The target-language app will need to define a class that implements the")
@doc("StrobeDelegate interface, and pass in an object of that class when creating")
@doc("the Strobe object. The StrobeDelegate object will receive callbacks when")
@doc("various discoball events happen.")
namespace Strobe {
  @doc("Interface for a delegate object that can receive callbacks when various")
  @doc("discoball events happen.")
  class StrobeDelegate {
    @doc("Called when our connection to the discoball completes.")
    void connected() {}

    @doc("Called whenever the discoball hands us a routing-table update.")
    @doc("The _entire_ new routing table is passed to the callback at present.")
    void routesUpdated(model.RoutingTable routingTable) {}
  }

  @doc("Main interface to the discoball")
  class Strobe extends client.CloudDiscoveryClient {
    StrobeDelegate delegate;

    @doc("Create a new Strobe instance paying attention to a named discoball host,")
    @doc("using a given token, sending callbacks to a given delegate.")
    static Strobe watchingHost(String hostName, String token, StrobeDelegate delegate) {
      // This is basically just a straightforward matter of creating a new 
      // CloudDiscoveryClient and then catching its events.
      client.GatewayOptions options = new client.GatewayOptions(token);
      options.gatewayHost = hostName;

      Strobe watcher = new Strobe(concurrent.Context.runtime(), options, null, null);

      watcher.delegate = delegate;

      self.logger.info("Connecting");
      watcher.connect();

      return watcher;
    }

    void onConnected(event.Connected connected) {
      // When connected, first make sure the superclass gets to do its thing...
      super.onConnected(connected);
      self.logger.info("Connected");

      // ...then vector to the delegate...
      self.delegate.connected();

      // ...then automagically subscribe to future updates.
      self.subscribe();
    }

    void onRoutesResponse(message.RoutesResponse response) {
      // When a routing-table update comes in, first make sure the superclass
      // gets to do its thing...
      super.onRoutesResponse(response);
      self.logger.info("RoutesResponse");

      // ...then vector to the delegate.
      self.delegate.routesUpdated(response.routes);
    }
  }
}
