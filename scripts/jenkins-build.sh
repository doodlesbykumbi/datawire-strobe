#!/bin/bash

set -ex
set -o pipefail

# Create a shiny new virtualenv for ourselves to work in.
virtualenv .autobuild-venv

set +x
. .autobuild-venv/bin/activate
set -x

# Smite any previous Quark & NVM installations
rm -rf .autobuild-quark .autobuild-nvm

# Initialize our world
make install-deps
make QUARKINSTALLARGS="-t $(pwd)/.autobuild-quark" QUARKBRANCH="develop" install-quark

. $(pwd)/.autobuild-quark/config.sh

# ...including node etc.
cp /dev/null .nvm_fake_profile
NVM_DIR="$(pwd)/.autobuild-nvm"

set +x

# Yes, really, the NVM_DIR setting in the 'env' command below does make sense.
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | \
	env NVM_DIR="$NVM_DIR" PROFILE="$(pwd)/.nvm_fake_profile" bash

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 4.2.2 &&
nvm alias default 4.2.2

set -x

export GIT_DEPLOY_DIR=dist
export GIT_DEPLOY_BRANCH=gh-pages

echo "==== env"
env | sort

echo "==== git"
git status

echo "==== versioner"

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
	echo "==== Skipping build"
	exit 1
fi

echo "==== Building ${VERSION} on ${CURRENT_BRANCH} at ${GIT_COMMIT}"

sed -i.bak -e "s/0\.0\.0/${VERSION}/" src/Version.jsx

# make

# bash scripts/deploy.sh -v

echo "Pretending build worked"

git checkout src/Version.jsx
rm src/Version.jsx.bak

git tag "v${VERSION}" "${GIT_COMMIT}"
git push --tags origin

