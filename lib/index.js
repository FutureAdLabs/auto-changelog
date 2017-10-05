#! /usr/bin/env node
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _fs = require('fs');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _parseGithubUrl = require('parse-github-url');

var _parseGithubUrl2 = _interopRequireDefault(_parseGithubUrl);

var _package = require('../package.json');

var _utils = require('./utils');

var _commits = require('./commits');

var _releases = require('./releases');

var _templates = require('./templates');

var _templates2 = _interopRequireDefault(_templates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OUTPUT = 'CHANGELOG.md';
var DEFAULT_TEMPLATE = 'default';
var NPM_VERSION_TAG_PREFIX = 'v';

_commander2.default.option('-o, --output [file]', 'output file, default: ' + DEFAULT_OUTPUT, DEFAULT_OUTPUT).option('-p, --package', 'use version from package.json as latest release').option('-t, --template [template]', 'specify template to use for output, templates: ' + Object.keys(_templates2.default).join(', '), DEFAULT_TEMPLATE).version(_package.version).parse(process.argv);

function getCommits() {
  return (0, _utils.cmd)('git log --shortstat --pretty=format:' + _commits.LOG_FORMAT).then(_commits.parseCommits);
}

function parseOrigin() {
  return (0, _utils.cmd)('git config --get remote.origin.url').then(function (origin) {
    if (!origin) {
      throw new Error('Must have a git remote called origin');
    }
    return (0, _parseGithubUrl2.default)(origin);
  });
}

function getPackageVersion() {
  if (_commander2.default.package) {
    return new Promise(function (resolve, reject) {
      (0, _fs.readFile)('package.json', 'utf-8', function (err, file) {
        if (err) reject(err);
        resolve(NPM_VERSION_TAG_PREFIX + JSON.parse(file).version);
      });
    });
  }
  return Promise.resolve(null);
}

function generateLog(_ref) {
  var _ref2 = _slicedToArray(_ref, 3);

  var commits = _ref2[0];
  var origin = _ref2[1];
  var packageVersion = _ref2[2];

  var Template = _templates2.default[_commander2.default.template];
  if (!Template) {
    throw new Error('Template \'' + _commander2.default.template + '\' was not found');
  }

  var releases = (0, _releases.parseReleases)(commits, packageVersion);
  var log = new Template(origin).render(releases);

  return new Promise(function (resolve, reject) {
    (0, _fs.writeFile)(_commander2.default.output, log, function (err) {
      if (err) reject(err);
      resolve(log);
    });
  });
}

function success(log) {
  var bytes = Buffer.byteLength(log, 'utf8');
  console.log(bytes + ' bytes written to ' + _commander2.default.output);
  process.exit(0);
}

function error(error) {
  console.error(error.message);
}

var promises = [getCommits(), parseOrigin(), getPackageVersion()];

Promise.all(promises).then(generateLog).then(success).catch(error);