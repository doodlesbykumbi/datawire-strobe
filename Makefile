all: browser

publish:
	@if [ $$(git status -s | wc -l) -gt 0 ]; then \
		echo "You cannot publish with a dirty tree." ;\
	else \
		echo "Publishing to gh-pages..." ;\
		git subtree push --prefix dist origin gh-pages ;\
	fi

browser: checkEnv npm quark dist/browser.js

checkEnv:
	@which -s quark || { \
		echo "Could not find quark -- is the correct venv active?" >&2 ;\
		exit 1 ;\
	}
	@which -s npm || { \
		echo "Could not find npm -- is it installed?" >&2 ;\
		exit 1 ;\
	}

node_modules:
	mkdir node_modules

pure-js: 
	mkdir pure-js

npm: node_modules
	npm install

.ALWAYS:

test: .ALWAYS
	npm test

quark: node_modules .ALWAYS
	quark install --javascript quark/strobe.q 

token:
	@echo grabbing service token
	@eval $$(dwc service-token hello | sed -e's/ //g') ;\
	\
	if [ -z $$(npm root) ]; then \
		echo 'no npm root? WTFO?' >&2 ;\
		exit 1 ;\
	fi ;\
	if [ -n "$$svc_token" ]; then \
		echo "module.exports = { token: '$$svc_token' };" > "$$(npm root)/token.js" ;\
		exit 0 ;\
	else \
		echo "no 'hello' token??" >&2 ;\
		exit 1 ;\
	fi

SOURCEFILES= \
	src/index.jsx \
	src/reducer.jsx \
	src/stroboscope.jsx \
	src/components/App.jsx
	# src/components/Login.jsx \
	# src/components/MainDashboard.jsx

QUARKFILES= \
	quark/strobe.qc

# Need to restore token
dist/browser.js: token $(SOURCEFILES)
	"$$(npm bin)/babel" -s -d pure-js src
	npm test
	cd pure-js && "$$(npm bin)/browserify" -d -o ../dist/browser.js \
		-x ws \
		-r quark \
		-r quark/quark_node_runtime \
		-r token \
		-r strobe \
		index.js

bmin.js: browser.js
	"$$(npm bin)/uglifyjs" \
		--mangle --compress --stats -o bmin.js browser.js 2>&1 \
	   | fgrep -v 'Dropping unused' \
	   | fgrep -v 'Side effects in initialization of unused variable' \
	   | fgrep -v 'Dropping unreachable code' \
	   | fgrep -v 'Declarations in unreachable code' \
	   | fgrep -v 'Condition always false'

clean:
	-rm -f dist/browser.js

clobber: clean
	-find . -name '*.qc' -print0 | xargs -0 rm
	-rm -rf pure-js
	-rm -rf node_modules

