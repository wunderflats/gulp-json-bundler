'use strict';

var through = require('through2');
var objectPath = require('object-path');
var File = require('vinyl');
var deepAssign = require('deep-assign');
var path = require('path');

module.exports = function jsonBundler(opts) {
  opts = opts || {};
  var master = opts.master || '';
  var omit = opts.omit || '';
  var contents = {};

  return through.obj(gatherJson, bundleJson);

  function gatherJson(chunc, enc, cb) {
    var localePath = path.relative(chunc.base, path.dirname(chunc.path)).replace(new RegExp(omit, 'g'), '');

    // remove first and last slash
    localePath = localePath.replace( /\\/g, '/' ); //change antislashes to slashes for Windows paths
    localePath = localePath.replace(/^\/|\/$/g, '');
    var fileName = path.basename(chunc.path);
    var content = {};
    objectPath.set(content, localePath.replace(/\//g, '.'), JSON.parse(chunc.contents));

    contents[fileName] = contents[fileName] || {};
    deepAssign(contents[fileName], content);

    cb();
  }

  function bundleJson(cb) {
    Object
      .keys(contents)
      .map(fileName => {
        var values = deepAssign({}, contents[master] || {}, contents[fileName]);
        return new File({
          path: fileName,
          contents: new Buffer(JSON.stringify(values))
        });
      })
      .forEach(file => this.push(file));
    cb();
  }
};
