'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cmd = cmd;

var _child_process = require('child_process');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

// Simple util for calling a child process
function cmd(string) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _string$split = string.split(' ');

  var _string$split2 = _toArray(_string$split);

  var cmd = _string$split2[0];

  var args = _string$split2.slice(1);

  return new Promise(function (resolve, reject) {
    var child = (0, _child_process.spawn)(cmd, args, options);
    var data = '';

    child.stdout.on('data', function (buffer) {
      data += buffer.toString();
    });
    child.stdout.on('end', function () {
      return resolve(data);
    });
    child.on('error', reject);
  });
}