var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var watchify = require("watchify");

var args = process.argv.splice(process.execArgv.length + 2);

var opts = {
  basedir: "src",
  extensions: [ '.jsx' ],
  debug: true,
  cache: {},
  packageCache: {},
};

var doWatch = ((args.length > 0) && (args[0] == "--watch"));

if (doWatch) {
  opts.plugin = [ watchify ];
  opts.verbose = true;
}

var b = browserify(opts);

b.add("index.jsx");

b.require([
  'quark',
  'quark/quark_node_runtime',
  'Strobe'
]);

b.exclude('ws');

b.transform(babelify, { presets: [ "es2015" ]});

function bundle() {
  b.bundle().pipe(fs.createWriteStream("dist/browser.js"));
}

if (doWatch) {
  b.on('update', bundle);
  b.on('log', function (x) {
    console.log(new Date(), x);
  });

  console.log("running initial bundle...");
}

bundle();

