#!/bin/bash

set -ex
set -o pipefail

# Create a shiny new virtualenv for ourselves to work in.
virtualenv .autobuild-venv
. .autobuild-venv/bin/activate

# Smite any previous Quark & NVM installations
rm -rf .autobuild-quark .autobuild-nvm

# Initialize our world
make QUARKINSTALLARGS="-t $(pwd)/.autobuild-quark" QUARKBRANCH="flynn/defect/logFixes" install-quark

. $(pwd)/.autobuild-quark/config.sh

# ...including node etc.
cp /dev/null .nvm_fake_profile
NVM_DIR="$(pwd)/.autobuild-nvm"

# Yes, really, the NVM_DIR setting in the 'env' command below does make sense.
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | \
	env NVM_DIR="$NVM_DIR" PROFILE="$(pwd)/.nvm_fake_profile" bash

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 4.2.2 &&
nvm alias default 4.2.2

make

