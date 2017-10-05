'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Default = require('./templates/Default');

var _Default2 = _interopRequireDefault(_Default);

var _Compact = require('./templates/Compact');

var _Compact2 = _interopRequireDefault(_Compact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  default: _Default2.default,
  compact: _Compact2.default
};