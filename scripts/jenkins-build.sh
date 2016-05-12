#!/bin/bash

set -e
set -o pipefail

step () {
	echo "==== $@"
}

msg () {
	echo "== $@"
}

step "Initializing build environment"

# Smite any previous Quark & NVM installations
rm -rf .autobuild-quark .autobuild-nvm

# Create a shiny new virtualenv for ourselves to work in.
msg "virtualenv..."

virtualenv .autobuild-venv
. .autobuild-venv/bin/activate

# Initialize our world

msg "python packages..."
make install-deps

msg "quark..."
make QUARKINSTALLARGS="-qqq -t $(pwd)/.autobuild-quark" QUARKBRANCH="develop" install-quark

. $(pwd)/.autobuild-quark/config.sh

# ...including node etc.

msg "nvm..."

cp /dev/null .nvm_fake_profile
NVM_DIR="$(pwd)/.autobuild-nvm"

# Yes, really, the NVM_DIR setting in the 'env' command below does make sense.
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | \
	env NVM_DIR="$NVM_DIR" PROFILE="$(pwd)/.nvm_fake_profile" bash

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 4.2.2 &&
nvm alias default 4.2.2

step "Work out next version"

export GIT_DEPLOY_DIR=dist
export GIT_DEPLOY_BRANCH=gh-pages

CURRENT_BRANCH=${GIT_BRANCH##*/}

if [ $CURRENT_BRANCH = "master" ]; then
	export GIT_DEPLOY_REPO=origin

	VERSION=$(python scripts/versioner.py --verbose)
else
	git remote add strobe-dev git@github.com:datawire/strobe-dev.git

	export GIT_DEPLOY_REPO=strobe-dev

	VERSION=$(python scripts/versioner.py --verbose --magic-pre)
fi

if [ -z "$VERSION" ]; then
	step "Skipping build"
	exit 1
fi

step "Building ${VERSION} on ${CURRENT_BRANCH} at ${GIT_COMMIT}"

msg "updating Version.jsx"

sed -i.bak -e "s/0\.0\.0/${VERSION}/" src/Version.jsx

msg "make"
make

msg "deploy"
bash scripts/deploy.sh -v

step "Tagging v${VERSION}"

git checkout src/Version.jsx
rm src/Version.jsx.bak

git tag -a "v${VERSION}" -m "v${VERSION} by Jenkins" "${GIT_COMMIT}"
git push --tags origin
