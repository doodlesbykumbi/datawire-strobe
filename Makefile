QUARKINSTALLER=https://raw.githubusercontent.com/datawire/quark/develop/install.sh
UTILSINSTALLER=https://raw.githubusercontent.com/datawire/utilities/master/install.sh

all: browser

publish:
	@echo "use deploy.sh instead -- see jenkins-build.sh for help" >&2
	@exit 1

publish-production:
	@echo "use deploy.sh instead -- see jenkins-build.sh for help" >&2
	@exit 1

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

install-deps:
	pip install semantic_version docopt gitpython

# install-utilities isn't needed during ordinary builds; it's needed for CI/CD
install-utilities:
	curl -lL "${UTILSINSTALLER}" | bash -s -- ${UTILSINSTALLARGS} ${UTILSBRANCH}

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
	src/components/Login.jsx \
	src/components/Signup.jsx \
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
	-rm -rf node_modules utilities
