'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOG_FORMAT = undefined;
exports.parseCommits = parseCommits;
exports.findFixes = findFixes;
exports.findMerge = findMerge;

var _arrayPrototype = require('array.prototype.find');

var _arrayPrototype2 = _interopRequireDefault(_arrayPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_arrayPrototype2.default.shim();

var COMMIT_SEPARATOR = '__AUTO_CHANGELOG_COMMIT_SEPARATOR__';
var MESSAGE_SEPARATOR = '__AUTO_CHANGELOG_MESSAGE_SEPARATOR__';

var LOG_FORMAT = exports.LOG_FORMAT = COMMIT_SEPARATOR + '%H%n%D%n%aI%n%an%n%ae%n%B' + MESSAGE_SEPARATOR;

var MATCH_COMMIT = /(.*)\n(.*)\n(.*)\n(.*)\n(.*)\n([\S\s]+)/;
var MATCH_STATS = /(\d+) files? changed(?:, (\d+) insertions?...)?(?:, (\d+) deletions?...)?/;
var TAG_PREFIX = 'tag: ';

// https://help.github.com/articles/closing-issues-via-commit-messages
var MATCH_ISSUE_FIX = /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s(#\d+|https?:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/\d+)/gi;
var MATCH_PULL_MERGE = /Merge pull request (#\d+) from .+\n\n(.+)/;

function parseCommits(string) {
  return string.split(COMMIT_SEPARATOR).slice(1).map(function (commit) {
    var _commit$match = commit.match(MATCH_COMMIT);

    var _commit$match2 = _slicedToArray(_commit$match, 7);

    var hash = _commit$match2[1];
    var refs = _commit$match2[2];
    var date = _commit$match2[3];
    var author = _commit$match2[4];
    var email = _commit$match2[5];
    var tail = _commit$match2[6];

    var _tail$split = tail.split(MESSAGE_SEPARATOR);

    var _tail$split2 = _slicedToArray(_tail$split, 2);

    var message = _tail$split2[0];
    var stats = _tail$split2[1];

    return _extends({
      hash: hash,
      tag: refs ? tagFromRefs(refs) : null,
      author: author,
      email: email,
      date: date,
      subject: getSubject(message),
      message: message.trim()
    }, parseStats(stats.trim()));
  });
}

function tagFromRefs(refs) {
  var valid = refs.split(', ').find(function (ref) {
    return ref.indexOf(TAG_PREFIX) === 0;
  });
  return valid ? valid.replace(TAG_PREFIX, '') : null;
}

function parseStats(stats) {
  if (!stats) return {};

  var _stats$match = stats.match(MATCH_STATS);

  var _stats$match2 = _slicedToArray(_stats$match, 4);

  var files = _stats$match2[1];
  var insertions = _stats$match2[2];
  var deletions = _stats$match2[3];

  return {
    files: parseInt(files || 0, 10),
    insertions: parseInt(insertions || 0, 10),
    deletions: parseInt(deletions || 0, 10)
  };
}

function findFixes(message) {
  var fixes = [];
  var match = MATCH_ISSUE_FIX.exec(message);
  if (!match) return null;
  while (match) {
    fixes.push(match[1] || match[2]);
    match = MATCH_ISSUE_FIX.exec(message);
  }
  return fixes;
}

function findMerge(message) {
  var match = message.match(MATCH_PULL_MERGE);
  if (match) {
    return {
      pr: match[1],
      message: match[2]
    };
  }
  return null;
}

function getSubject(message) {
  return message.match(/[^\n]+/)[0];
}