/*
 * Warning: shameless self-plug!
 * Plumber is the Guardian’s tool of choice for build systems.
 * https://github.com/plumberjs/plumber
 */

var all       = require('plumber-all');
// var bower  = require('plumber-bower');
var glob      = require('plumber-glob');
var requireJS = require('plumber-requirejs');
var uglifyJS  = require('plumber-uglifyjs')();
var write     = require('plumber-write');

module.exports = function (pipelines) {
  var mainRequireJS = requireJS({
      // FIXME: auto?
      preserveLicenseComments: false,
      paths: {
          'lodash-amd': '../bower_components/lodash-amd',
          'immutable': '../bower_components/immutable'
      }
  });

  var toBuildDir = write('./build');
  var writeBoth = all(
    [uglifyJS, toBuildDir],
    toBuildDir
  );

  /* jshint -W069 */

  // We probably won't ever need this default build process at Format,
  // since we're unlikely to start using RequireJS or another AMD dep
  // management lib. Let's keep it around in case upstream decides to
  // optimize/change the default build process. Merging upstream will
  // be easier to do if this code block is kept intact.
  pipelines['build'] = [
    // TODO: use bower operation to find main of this component?
    // As per: https://github.com/bower/bower/issues/1090
    // bower('scribe'),
    glob('./src/scribe.js'),
    mainRequireJS,
    // Send the resource along these branches
    writeBoth
  ];

  // This is the build process for Format. It creates a UMD version of
  // the Scribe library in the build/format directory. The file is called
  // scribe.js. This is the file that we use in the format repo:
  // http://bit.ly/1u0iqmP.
  var rename = require('plumber-rename');
  var umdRequireJS = requireJS({
    preserveLicenseComments: false,
    paths: {
      'lodash-amd': '../bower_components/lodash-amd',
      'immutable': '../bower_components/immutable'
    },
    include: ['scribe'],
    wrap: {
      start: "(function (root, factory) {\n" +
      "  if (typeof define === 'function' && define.amd) {\n" +
      "    define([], factory);\n" +
      "  } else {\n" +
      "    root.Scribe = factory();\n" +
      "  }\n" +
      "}(this, function () {\n\n",
      end: "return require('scribe');\n" +
      "}));"
    }
  });
  var toFormatBuildDir = write('./build/format');
  var sources = glob.within('src');
  pipelines['format'] = [
    sources('almond.js'),
    rename('scribe'),
    umdRequireJS,
    toFormatBuildDir.omitSourceMap
  ];
};
