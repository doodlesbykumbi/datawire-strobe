#!/bin/bash

set -ex
set -o pipefail

# Create a shiny new virtualenv for ourselves to work in.
virtualenv .autobuild-venv
. .autobuild-venv/bin/activate

# Smite any previous Quark installation
rm -rf .autobuild-quark

# Initialize our world
make QUARKINSTALLARGS="-t $(pwd)/.autobuild-quark" QUARKBRANCH="flynn/defect/logFixes" install-quark

. $(pwd)/.autobuild-quark/config.sh

make

