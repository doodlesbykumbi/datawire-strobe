# Strobe

...because disco balls are always better with strobe lights.

## Overview

This is a proof of concept dashboard for the Datawire Connect discovery system. Watch this space -- it'll move from "proof of concept" to real pretty quickly.

## Building

You'll need `quark` and the Datawire Cloud Tools installed:

        pip install datawire-quark datawire-cloudtools

and you'll need a Datawire Connect organization with a service called "hello" created:

        dwc create-org --help

has instructions for creating an organization, and once that's done

        dwc create-service hello

will create the service you need. (You won't need the service shortly -- in the proof of concept, we use the service token to avoid needing a real login mechanism. That will be changing very very soon.)

Once that's set up, type

        make

and stand back! If all goes well, you can open

        dist/index.html

in Chrome.


