'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseReleases = parseReleases;

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _commits = require('./commits');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseReleases(commits, packageVersion) {
  var initial = [newRelease(packageVersion)];
  return commits.reduce(commitReducer, initial).reverse();
}

function newRelease(tag) {
  var date = arguments.length <= 1 || arguments[1] === undefined ? new Date().toISOString() : arguments[1];

  var release = {
    commits: [],
    fixes: [],
    merges: []
  };
  if (tag) {
    release.tag = tag;
    release.date = date;
  }
  return release;
}

function commitReducer(releases, commit) {
  if (commit.tag && _semver2.default.valid(commit.tag)) {
    releases.unshift(newRelease(commit.tag, commit.date));
  }

  var merge = (0, _commits.findMerge)(commit.message);
  var fixes = (0, _commits.findFixes)(commit.message);

  if (merge) {
    releases[0].merges.push(merge);
  } else if (fixes) {
    releases[0].fixes.push({ fixes: fixes, commit: commit });
  } else if (filterCommit(commit)) {
    releases[0].commits.push(commit);
  }

  return releases;
}

function filterCommit(commit) {
  return !_semver2.default.valid(commit.subject); // Filter out version commits
}