QUARKINSTALLER=https://raw.githubusercontent.com/datawire/quark/flynn/feature/installerGetOpts/install.sh

all: browser

publish:
	@if [ $$(git status -s | wc -l) -gt 0 ]; then \
		echo "You cannot publish with a dirty tree." ;\
	else \
		echo "Publishing to gh-pages (dev)..." ;\
		git subtree push --prefix dist strobe-dev gh-pages ;\
	fi

publish-production:
	@if [ $$(git status -s | wc -l) -gt 0 ]; then \
		echo "You cannot publish with a dirty tree." ;\
	else \
		echo "Publishing to gh-pages (production)..." ;\
		git subtree push --prefix dist origin gh-pages ;\
	fi

browser: checkEnv npm test dist/browser.js

checkEnv:
	# @which dwc >/dev/null 2>&1 || { \
	# 	echo "Could not find dwc -- is the correct venv active?" >&2 ;\
	# 	echo "(use 'make pip' to initialize dwc in a new venv)" >&2 ;\
	# 	exit 1 ;\
	# }
	@which quark >/dev/null 2>&1 || { \
		echo "Could not find quark -- is the correct venv active?" >&2 ;\
		echo "(use 'make install-quark' to initialize things in a new venv)" >&2 ;\
		exit 1 ;\
	}
	@which npm >/dev/null 2>&1 || { \
		echo "Could not find npm -- is it installed?" >&2 ;\
		echo "(if not, check out https://docs.npmjs.com/getting-started/installing-node)" >&2 ;\
		exit 1 ;\
	}

install-quark:
	curl -sL "${QUARKINSTALLER}" | bash -s -- ${QUARKINSTALLARGS} ${QUARKBRANCH}

datawire-connect: checkEnv
	quark install --python https://raw.githubusercontent.com/datawire/datawire-connect/master/quark/datawire_connect-1.1.q
	pip install datawire-cloudtools

node_modules:
	mkdir node_modules

npm: node_modules
	npm install >/dev/null	# What an appalling command.

.ALWAYS:

test: .ALWAYS
	npm test

QUARKFILES= \
	quark/identity.qc \
	quark/strobe.qc

%.qc : %.q
	quark install --javascript $<

SOURCEFILES= \
	src/components/App.jsx \
	src/components/Error.jsx \
	src/components/LoginOrSignup.jsx \
	src/components/RouteTable.jsx \
	src/components/UserInfo.jsx \
	src/Discoball.jsx \
	src/Version.jsx \
	src/index.jsx \
	src/reduceFocusedService.jsx \
	src/reducer.jsx \
	src/reduceRoutes.jsx \
	src/reduceUser.jsx \
	src/stroboscope.jsx \
	src/utils.jsx 
		
dist/browser.js: $(SOURCEFILES) $(QUARKFILES)
	npm run build

watch:
	npm run watch

bmin.js: browser.js
	"$$(npm bin)/uglifyjs" \
		--mangle --compress --stats -o bmin.js browser.js 2>&1 \
	   | fgrep -v 'Dropping unused' \
	   | fgrep -v 'Side effects in initialization of unused variable' \
	   | fgrep -v 'Dropping unreachable code' \
	   | fgrep -v 'Declarations in unreachable code' \
	   | fgrep -v 'Condition always false'

clean:
	-rm -f dist/browser.js quark/*.qc

clobber: clean
	-find . -name '*.qc' -print0 | xargs -0 rm
	-rm -rf node_modules

