"""discolie.py

Lie to the discoball about what services are out there.

Usage: 
    discolie.py [-n] <service> <instances> [(<service> <instances>)]...
"""

import sys

import logging
import random

logging.basicConfig(level=logging.INFO)

from docopt import docopt

from datawire_connect.resolver import DiscoveryProvider as DWCProvider
from datawire_connect.state import DatawireState
from datawire_discovery.model import Endpoint as DWCEndpoint
from datawire_discovery.client import GatewayOptions as DWCOptions

def main():
    args = docopt(__doc__, version="discolie {0}".format("1.0"))
    dryrun = args["-n"]

    for (service, instances) in zip(args['<service>'], args['<instances>']):
        instances = int(instances)

        # Grab our service token.
        dwState = DatawireState.defaultState()
        token = dwState.getCurrentServiceToken(service)

        if not token:
            raise Exception("%s: no token??" % service)

        logging.info("Lying about %d instance%s of %s..." % 
                     (instances, 
                      "" if (instances == 1) else "s",
                      service))

        instancesPerHost = int(random.random() * 10) + 1

        for instance in range(instances):
            host = "%s-%d.liar.datawire.io" % (service, instance % instancesPerHost)
            port = 1000 + instance
            url = "http://%s:%d/" % (host, port)

            if not dryrun:
                endpoint = DWCEndpoint('http', host, port, url)
                options = DWCOptions(token)
                provider = DWCProvider(options, service, endpoint)
                provider.register(15.0)

                logging.debug("lied about server on %s" % url)
            else:
                logging.debug("would lie about server on %s" % url)

if __name__ == '__main__':
    main()
